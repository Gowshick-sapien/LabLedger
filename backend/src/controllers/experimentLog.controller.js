import db from "../config/db.js";

/**
 * POST /experiments/:experimentId/logs
 * Append-only write
 */
export const addExperimentLog = async (req, res) => {
  try {
    const { experimentId } = req.params;
    const { procedure, observations, outcome, parameters } = req.body;

    if (!procedure || !observations || !outcome) {
      return res.status(400).json({
        message: "procedure, observations, and outcome are required",
      });
    }

    // validate experiment exists
    const expCheck = await db.query(
      "SELECT id FROM experiments WHERE id = $1",
      [experimentId]
    );

    if (expCheck.rows.length === 0) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    // insert append-only log
    const result = await db.query(
      `INSERT INTO experiment_logs
       (experiment_id, procedure, observations, outcome, parameters)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, procedure, observations, outcome, parameters, created_at`,
      [
        experimentId,
        procedure,
        observations,
        outcome,
        parameters ? JSON.stringify(parameters) : null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add experiment log" });
  }
};

/**
 * GET /experiments/:experimentId/logs
 * Read-only
 * ✅ NOW INCLUDES ATTACHMENT URL
 */
export const listExperimentLogs = async (req, res) => {
  try {
    const { experimentId } = req.params;

    const result = await db.query(
      `
      SELECT
        el.id,
        el.procedure,
        el.observations,
        el.outcome,
        el.parameters,
        el.created_at,
        a.storage_url AS attachment_url
      FROM experiment_logs el
      LEFT JOIN attachments a
        ON a.log_id = el.id
      WHERE el.experiment_id = $1
      ORDER BY el.created_at ASC
      `,
      [experimentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};




