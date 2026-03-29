import sendEmail from "../services/email.service.js";

const normalize = (value) => value?.trim() || "";
const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const submitContactForm = async (req, res) => {
  try {
    const name = normalize(req.body.name);
    const email = normalize(req.body.email).toLowerCase();
    const organization = normalize(req.body.organization);
    const requestType = normalize(req.body.requestType);
    const message = normalize(req.body.message);

    if (!name || !email || !requestType || !message) {
      return res.status(400).json({
        message: "Name, email, request type, and message are required.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const supportEmail =
      process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER;

    if (!supportEmail) {
      return res.status(500).json({
        message: "Contact email is not configured on the server.",
      });
    }

    const safeOrganization = organization || "Not provided";
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeRequestType = escapeHtml(requestType);
    const safeOrganizationHtml = escapeHtml(safeOrganization);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    await sendEmail({
      to: supportEmail,
      subject: `New Contact Inquiry: ${requestType}`,
      html: `
        <h2>New contact inquiry</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Organization:</strong> ${safeOrganizationHtml}</p>
        <p><strong>Request type:</strong> ${safeRequestType}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    await sendEmail({
      to: email,
      subject: "We received your inquiry",
      html: `
        <h2>Inquiry received</h2>
        <p>Hello ${safeName},</p>
        <p>
          Your message has been received by the HEM & SMS support team. We will
          review your request and follow up as soon as possible.
        </p>
        <p><strong>Request type:</strong> ${safeRequestType}</p>
        <p><strong>Organization:</strong> ${safeOrganizationHtml}</p>
        <p><strong>Your message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    return res.status(200).json({
      message: "Your inquiry has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return res.status(500).json({
      message: "Unable to send your inquiry right now. Please try again later.",
    });
  }
};
