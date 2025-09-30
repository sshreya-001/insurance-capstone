import AuditLog from "../models/AuditLog.js";

const audit = async (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;
    try {
      await AuditLog.create({
        action: `${req.method} ${req.originalUrl}`,
        actorId: req.user?.id || null,
        details: { body: req.body, query: req.query },
        ip: req.ip,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Failed to save audit log:", err);
    }
  });

  next();
};

export default audit;
