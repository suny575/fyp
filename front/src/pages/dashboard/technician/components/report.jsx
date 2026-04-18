import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import QrScanner from "react-qr-scanner";
import "../styles/report.css";
import { getStoredToken } from "../../../../utils/authStorage.js";

const MIN_SEARCH_LENGTH = 2;
const SEARCH_DELAY_MS = 280;
const SCAN_UNLOCK_DELAY_MS = 1200;

const normalizeText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const getEquipmentDisplayId = (equipment) =>
  equipment?.serial || equipment?._id || "";

const getEquipmentSearchScore = (equipment, query) => {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return 0;

  const name = normalizeText(equipment?.name);
  const model = normalizeText(equipment?.model);
  const serial = normalizeText(equipment?.serial);
  const department = normalizeText(equipment?.department);
  const manufacturer = normalizeText(equipment?.manufacturer);

  if (
    serial === normalizedQuery ||
    normalizeText(equipment?._id) === normalizedQuery
  ) {
    return 120;
  }

  if (name === normalizedQuery) return 100;
  if (name.startsWith(normalizedQuery)) return 90;
  if (name.includes(` ${normalizedQuery}`)) return 80;
  if (serial.startsWith(normalizedQuery)) return 76;
  if (model.startsWith(normalizedQuery)) return 60;
  if (manufacturer.startsWith(normalizedQuery)) return 52;
  if (department.startsWith(normalizedQuery)) return 46;
  if (name.includes(normalizedQuery)) return 40;
  if (serial.includes(normalizedQuery)) return 35;
  if (model.includes(normalizedQuery)) return 24;
  if (manufacturer.includes(normalizedQuery)) return 22;
  if (department.includes(normalizedQuery)) return 18;

  return 0;
};

const rankEquipmentMatches = (items, query) =>
  [...items]
    .map((item) => ({
      item,
      score: getEquipmentSearchScore(item, query),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return (left.item?.name || "").localeCompare(right.item?.name || "");
    })
    .map((entry) => entry.item);

const extractDirectScanValue = (scanResult) =>
  typeof scanResult === "string"
    ? scanResult
    : scanResult?.text ||
      scanResult?.data ||
      scanResult?.rawValue ||
      scanResult?.value ||
      "";

const extractScanCandidates = (scanResult) => {
  const directValue = extractDirectScanValue(scanResult);
  const rawValues = directValue ? [directValue] : [];
  const parsedValues = [];

  try {
    const parsed = JSON.parse(String(directValue));

    if (typeof parsed === "string") {
      parsedValues.push(parsed);
    } else if (parsed && typeof parsed === "object") {
      parsedValues.push(
        parsed.serial,
        parsed._id,
        parsed.id,
        parsed.equipmentId,
        parsed.equipment_id,
        parsed.name,
        parsed.code,
      );
    }
  } catch {
    const matchedValue = String(directValue).match(
      /(?:serial|equipment(?:_id)?|id)\s*[:=]\s*([^,;\n]+)/i,
    );

    if (matchedValue?.[1]) {
      parsedValues.push(matchedValue[1]);
    }

    try {
      const url = new URL(String(directValue));
      parsedValues.push(
        url.searchParams.get("serial"),
        url.searchParams.get("id"),
        url.searchParams.get("equipmentId"),
        url.searchParams.get("equipment_id"),
      );
    } catch {
      // Ignore values that are not valid URLs.
    }
  }

  return [...rawValues, ...parsedValues]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);
};

const extractSupportDetailsFromScan = (scanResult) => {
  const directValue = String(extractDirectScanValue(scanResult) || "").trim();
  const details = {
    manufacturer: "",
    supportEmail: "",
    supportWebsite: "",
    sourceLabel: "",
  };

  if (!directValue) return details;

  const emailMatch = directValue.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (emailMatch) {
    details.supportEmail = emailMatch[0];
  }

  try {
    const parsed = JSON.parse(directValue);

    if (parsed && typeof parsed === "object") {
      details.manufacturer =
        parsed.manufacturer ||
        parsed.vendor ||
        parsed.company ||
        parsed.owner ||
        "";
      details.supportEmail =
        parsed.supportEmail || parsed.email || details.supportEmail;
      details.supportWebsite =
        parsed.supportWebsite || parsed.website || parsed.url || "";
    }
  } catch {
    try {
      const url = new URL(directValue);
      details.supportWebsite = url.toString();
      details.sourceLabel = url.hostname.replace(/^www\./i, "");
      if (!details.manufacturer) {
        details.manufacturer = details.sourceLabel;
      }
    } catch {
      // Ignore non-URL scan text.
    }
  }

  return details;
};

const findExactEquipmentMatch = (items, query) => {
  const normalizedQuery = normalizeText(query);

  return (
    items.find(
      (item) =>
        normalizeText(item?.serial) === normalizedQuery ||
        normalizeText(item?._id) === normalizedQuery ||
        normalizeText(item?.name) === normalizedQuery,
    ) || null
  );
};

const buildMailtoLink = ({
  email,
  equipmentName,
  equipmentId,
  description,
  escalationNote,
}) => {
  if (!email) return "#";

  const subject = `Support request: ${equipmentName || "Equipment"} ${equipmentId ? `(${equipmentId})` : ""}`.trim();
  const body = [
    "Hello support team,",
    "",
    `Equipment: ${equipmentName || "Unknown equipment"}`,
    `Serial / ID: ${equipmentId || "Unknown"}`,
    escalationNote ? `Escalation note: ${escalationNote}` : "",
    description ? `Issue summary: ${description}` : "",
    "",
    "Please advise on the next support steps.",
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const EquipmentReport = () => {
  const [equipmentName, setEquipmentName] = useState("");
  const [equipmentQuery, setEquipmentQuery] = useState("");
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentId, setEquipmentId] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [description, setDescription] = useState("");
  const [escalationNote, setEscalationNote] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchMessage, setSearchMessage] = useState("");
  const [scannerMessage, setScannerMessage] = useState(
    "Type 2+ letters or scan the QR.",
  );
  const [qrSupportData, setQrSupportData] = useState({
    manufacturer: "",
    supportEmail: "",
    supportWebsite: "",
    sourceLabel: "",
  });

  const token = getStoredToken();
  const blurTimerRef = useRef(null);
  const scanUnlockTimerRef = useRef(null);
  const scanLockedRef = useRef(false);

  useEffect(() => {
    const trimmedQuery = equipmentQuery.trim();

    if (!trimmedQuery) {
      setEquipmentList([]);
      setSearchLoading(false);
      setSearchMessage("Search by name, serial, model, or maker.");
      setHighlightedIndex(-1);
      return undefined;
    }

    if (trimmedQuery.length < MIN_SEARCH_LENGTH) {
      setEquipmentList([]);
      setSearchLoading(false);
      setSearchMessage(`Type at least ${MIN_SEARCH_LENGTH} letters.`);
      setHighlightedIndex(-1);
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      setSearchLoading(true);

      try {
        const response = await axios.get("http://localhost:5000/api/equipment", {
          params: {
            search: trimmedQuery,
            limit: 12,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        const matches = rankEquipmentMatches(
          Array.isArray(response.data) ? response.data : [],
          trimmedQuery,
        );

        setEquipmentList(matches);
        setHighlightedIndex(matches.length > 0 ? 0 : -1);
        setSearchMessage(
          matches.length > 0
            ? `${matches.length} match${matches.length > 1 ? "es" : ""}`
            : "No match found.",
        );
      } catch (error) {
        console.error("Failed to fetch equipment:", error.message);
        setEquipmentList([]);
        setHighlightedIndex(-1);
        setSearchMessage("Search failed. Try again.");
      } finally {
        setSearchLoading(false);
      }
    }, SEARCH_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [equipmentQuery, token]);

  useEffect(() => {
    return () => {
      if (blurTimerRef.current) {
        window.clearTimeout(blurTimerRef.current);
      }

      if (scanUnlockTimerRef.current) {
        window.clearTimeout(scanUnlockTimerRef.current);
      }
    };
  }, []);

  const selectEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setEquipmentName(equipment?.name || "");
    setEquipmentQuery("");
    setEquipmentId(getEquipmentDisplayId(equipment));
    setEquipmentList([]);
    setSearchFocused(false);
    setHighlightedIndex(-1);
    setSearchMessage(`${equipment?.name || "Equipment"} selected.`);
    setScannerMessage(
      `Linked: ${equipment?.name || "equipment"}${equipment?.serial ? ` (${equipment.serial})` : ""}`,
    );
  };

  const handleEquipmentNameChange = (event) => {
    const nextValue = event.target.value;

    setEquipmentName(nextValue);
    setEquipmentQuery(nextValue);
    setSearchFocused(true);

    if (
      selectedEquipment &&
      normalizeText(nextValue) !== normalizeText(selectedEquipment?.name)
    ) {
      setSelectedEquipment(null);
      setEquipmentId("");
    }
  };

  const handleEquipmentNameKeyDown = (event) => {
    if (!equipmentList.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev < equipmentList.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : equipmentList.length - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      const equipmentToSelect =
        highlightedIndex >= 0
          ? equipmentList[highlightedIndex]
          : equipmentList[0];

      if (equipmentToSelect) {
        event.preventDefault();
        selectEquipment(equipmentToSelect);
      }
      return;
    }

    if (event.key === "Escape") {
      setSearchFocused(false);
    }
  };

  const unlockScanner = () => {
    if (scanUnlockTimerRef.current) {
      window.clearTimeout(scanUnlockTimerRef.current);
    }

    scanUnlockTimerRef.current = window.setTimeout(() => {
      scanLockedRef.current = false;
    }, SCAN_UNLOCK_DELAY_MS);
  };

  const lookupEquipmentFromScan = async (candidateValues) => {
    for (const candidate of candidateValues) {
      const response = await axios.get("http://localhost:5000/api/equipment", {
        params: {
          search: candidate,
          limit: 12,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const results = rankEquipmentMatches(
        Array.isArray(response.data) ? response.data : [],
        candidate,
      );

      const exactMatch = findExactEquipmentMatch(results, candidate);

      if (exactMatch) {
        return exactMatch;
      }

      if (results.length === 1) {
        return results[0];
      }
    }

    return null;
  };

  const handleScan = async (scanResult) => {
    if (!scanResult || scanLockedRef.current || lookupLoading) {
      return;
    }

    const candidates = extractScanCandidates(scanResult);
    const supportFromScan = extractSupportDetailsFromScan(scanResult);

    if (supportFromScan.supportEmail || supportFromScan.supportWebsite) {
      setQrSupportData(supportFromScan);
    }

    if (!candidates.length) {
      return;
    }

    scanLockedRef.current = true;
    setLookupLoading(true);
    setScannerMessage("QR detected. Checking equipment...");
    setEquipmentId(candidates[0]);

    try {
      const matchedEquipment = await lookupEquipmentFromScan(candidates);

      if (!matchedEquipment) {
        setScannerMessage(
          supportFromScan.supportWebsite || supportFromScan.supportEmail
            ? "Equipment not matched. QR support link captured."
            : "QR scanned, but equipment not found.",
        );
        return;
      }

      selectEquipment(matchedEquipment);
      setShowQRScanner(false);
    } catch (error) {
      console.error("QR lookup failed:", error.message);
      setScannerMessage("Scan worked, lookup failed.");
    } finally {
      setLookupLoading(false);
      unlockScanner();
    }
  };

  const handleError = (error) => {
    console.error("QR Scan Error:", error);
    setScannerMessage("Camera permission or scan failed.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!equipmentId || !description.trim()) {
      alert("Enter equipment ID and issue summary.");
      return;
    }

    setSubmitLoading(true);

    const reportDetails = [
      description.trim(),
      escalationNote.trim() ? `Escalation note: ${escalationNote.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const equipmentReference = selectedEquipment?._id || equipmentId.trim();

      await axios.post(
        "http://localhost:5000/api/equipmentReports",
        {
          equipment: equipmentReference,
          description: reportDetails,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Report submitted.");
      setEquipmentName("");
      setEquipmentQuery("");
      setEquipmentList([]);
      setEquipmentId("");
      setSelectedEquipment(null);
      setDescription("");
      setEscalationNote("");
      setShowQRScanner(false);
      setHighlightedIndex(-1);
      setSearchMessage("Search by name, serial, model, or maker.");
      setScannerMessage("Type 2+ letters or scan the QR.");
      setQrSupportData({
        manufacturer: "",
        supportEmail: "",
        supportWebsite: "",
        sourceLabel: "",
      });
    } catch (error) {
      console.error("Failed to submit report:", error.message);
      alert(error.response?.data?.message || "Error submitting report.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleScannerToggle = () => {
    setShowQRScanner((previous) => {
      const nextValue = !previous;

      setScannerMessage(
        nextValue ? "Point camera at the equipment QR." : "Type 2+ letters or scan the QR.",
      );

      return nextValue;
    });
  };

  const supportDetails = {
    manufacturer:
      selectedEquipment?.manufacturer || qrSupportData.manufacturer || "",
    supportEmail:
      selectedEquipment?.supportEmail || qrSupportData.supportEmail || "",
    supportWebsite:
      selectedEquipment?.supportWebsite || qrSupportData.supportWebsite || "",
    sourceLabel: qrSupportData.sourceLabel || "",
  };

  const showSupportPanel =
    Boolean(
      selectedEquipment ||
        qrSupportData.manufacturer ||
        qrSupportData.supportEmail ||
        qrSupportData.supportWebsite,
    );

  const showResultsPanel =
    searchFocused &&
    (searchLoading ||
      equipmentList.length > 0 ||
      equipmentQuery.trim().length >= MIN_SEARCH_LENGTH);

  const supportEmailLink = buildMailtoLink({
    email: supportDetails.supportEmail,
    equipmentName: selectedEquipment?.name || equipmentName,
    equipmentId,
    description,
    escalationNote,
  });

  return (
    <div className="report-page">
      <section className="report-hero">
        <div>
          <p className="report-eyebrow">Critical Report</p>
          <h1>Report severe equipment damage</h1>
          <p className="report-subtitle">
            Scan the QR, confirm the equipment, and escalate to owner support if needed.
          </p>
        </div>

        <div className="report-hero-badges">
          <span>Fast lookup</span>
          <span>QR support</span>
          <span>Owner contact</span>
        </div>
      </section>

      <div className="report-layout">
        <section className="report-shell">
          <div className="report-shell-header">
            <div>
              <h2>Equipment Escalation</h2>
              <p>Keep it short and accurate.</p>
            </div>

            <button
              type="button"
              className={`report-scan-toggle ${showQRScanner ? "is-active" : ""}`}
              onClick={handleScannerToggle}
            >
              {showQRScanner ? "Close scanner" : "Scan QR"}
            </button>
          </div>

          {lookupLoading || submitLoading ? (
            <div className="report-busy-state">
              <div className="td-dotted-loader" />
              <p className="td-loading-text">
                {submitLoading ? "Submitting report..." : "Checking equipment..."}
              </p>
            </div>
          ) : null}

          <form className="report-form" onSubmit={handleSubmit}>
            <div className="report-field">
              <label htmlFor="equipmentName">Equipment</label>
              <div className="report-search-wrap">
                <input
                  id="equipmentName"
                  type="text"
                  className="report-input"
                  placeholder="Search name, serial, model..."
                  value={equipmentName}
                  onChange={handleEquipmentNameChange}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => {
                    blurTimerRef.current = window.setTimeout(() => {
                      setSearchFocused(false);
                    }, 140);
                  }}
                  onKeyDown={handleEquipmentNameKeyDown}
                  autoComplete="off"
                />
                <div className="report-search-meta">
                  {searchLoading ? "Searching..." : searchMessage}
                </div>

                {showResultsPanel ? (
                  <div className="report-search-results">
                    {searchLoading ? (
                      <div className="report-search-state">Searching equipment...</div>
                    ) : equipmentList.length > 0 ? (
                      equipmentList.map((equipment, index) => (
                        <button
                          key={equipment._id}
                          type="button"
                          className={`report-search-result ${
                            highlightedIndex === index ? "is-highlighted" : ""
                          } ${
                            selectedEquipment?._id === equipment._id
                              ? "is-selected"
                              : ""
                          }`}
                          onMouseDown={() => selectEquipment(equipment)}
                        >
                          <span className="report-result-name">{equipment.name}</span>
                          <span className="report-result-meta">
                            {equipment.model || "No model"} |{" "}
                            {getEquipmentDisplayId(equipment)} |{" "}
                            {equipment.manufacturer || equipment.department || "No maker"}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="report-search-state">{searchMessage}</div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="report-field">
              <label htmlFor="equipmentId">Serial / ID</label>
              <input
                id="equipmentId"
                type="text"
                className="report-input"
                placeholder="Serial or scanned ID"
                value={equipmentId}
                onChange={(event) => {
                  setEquipmentId(event.target.value);

                  if (
                    selectedEquipment &&
                    normalizeText(getEquipmentDisplayId(selectedEquipment)) !==
                      normalizeText(event.target.value)
                  ) {
                    setSelectedEquipment(null);
                  }
                }}
                required
              />
            </div>

            {showQRScanner ? (
              <div className="report-scanner-panel">
                <div className="report-scanner-frame">
                  <QrScanner
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    constraints={{
                      audio: false,
                      video: { facingMode: { ideal: "environment" } },
                    }}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div className="report-scanner-overlay">
                    <div className="report-scanner-target" />
                  </div>
                </div>
                <p className="report-scanner-note">{scannerMessage}</p>
              </div>
            ) : null}

            {selectedEquipment ? (
              <div className="report-selected-card">
                <div>
                  <p className="report-selected-label">Selected equipment</p>
                  <h3>{selectedEquipment.name}</h3>
                </div>
                <div className="report-selected-grid">
                  <div>
                    <span>Serial</span>
                    <strong>{selectedEquipment.serial || "Not available"}</strong>
                  </div>
                  <div>
                    <span>Model</span>
                    <strong>{selectedEquipment.model || "Not available"}</strong>
                  </div>
                  <div>
                    <span>Maker</span>
                    <strong>{selectedEquipment.manufacturer || "Not set"}</strong>
                  </div>
                </div>
              </div>
            ) : null}

            {showSupportPanel ? (
              <div className="report-support-card">
                <div className="report-support-head">
                  <div>
                    <p className="report-selected-label">Owner support</p>
                    <h3>{supportDetails.manufacturer || "Support contact"}</h3>
                  </div>
                </div>

                <div className="report-support-grid">
                  <div>
                    <span>Email</span>
                    <strong>{supportDetails.supportEmail || "Not found"}</strong>
                  </div>
                  <div>
                    <span>Website</span>
                    <strong>
                      {supportDetails.supportWebsite
                        ? supportDetails.sourceLabel || "Support page"
                        : "Not found"}
                    </strong>
                  </div>
                </div>

                <div className="report-support-actions">
                  {supportDetails.supportEmail ? (
                    <a
                      className="report-support-button"
                      href={supportEmailLink}
                    >
                      Email support
                    </a>
                  ) : null}

                  {supportDetails.supportWebsite ? (
                    <a
                      className="report-support-button secondary"
                      href={supportDetails.supportWebsite}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open support site
                    </a>
                  ) : null}
                </div>

                <input
                  type="text"
                  className="report-input"
                  placeholder="Short reason for escalation"
                  value={escalationNote}
                  onChange={(event) => setEscalationNote(event.target.value)}
                />
              </div>
            ) : null}

            <div className="report-field">
              <label htmlFor="description">Issue summary</label>
              <textarea
                id="description"
                className="report-input report-textarea"
                rows="4"
                placeholder="What failed?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>

            <div className="report-actions">
              <button
                type="submit"
                className="report-submit"
                disabled={submitLoading}
              >
                {submitLoading ? "Submitting..." : "Submit Report"}
              </button>
              <p className="report-action-note">Manager review comes next.</p>
            </div>
          </form>
        </section>

        <aside className="report-side-panel">
          <div className="report-info-card">
            <p className="report-info-label">Quick use</p>
            <h3>When to use this page</h3>
            <ul>
              <li>Equipment is badly damaged.</li>
              <li>Technician cannot fix it internally.</li>
              <li>Owner or manufacturer support is needed.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EquipmentReport;
