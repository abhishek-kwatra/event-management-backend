
import db from '../models/db.js';


// Create Event
export const createEvent = async (req, res) => {
  const { event_name, description, event_date, event_time, duration } = req.body;

  try {
    const now = new Date();
    const inputDate = new Date(`${event_date}T${event_time}`);

    if (isNaN(inputDate.getTime())) {
      return res.status(400).json({ message: 'Invalid event date or time format' });
    }

    if (inputDate < now) {
      return res.status(400).json({ message: 'Event date and time cannot be in the past' });
    }

    const [result] = await db.promise().query(
      `INSERT INTO eventdetails (event_name, description, event_date, event_time, duration)
       VALUES (?, ?, ?, ?, ?)`,
      [event_name, description, event_date, event_time, duration]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event: {
        id: result.insertId,
        event_name,
        description,
        event_date,
        event_time,
        duration
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Get Event by ID
export const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const [events] = await db.promise().query(
      'SELECT * FROM eventdetails WHERE id = ?',
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ event: events[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Event by ID (Partial)

export const updateEventById = async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  try {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    
    if (fields.event_date || fields.event_time) {
      const [eventResult] = await db.promise().query(
        'SELECT event_date, event_time FROM eventdetails WHERE id = ?',
        [id]
      );

      if (eventResult.length === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const existingEvent = eventResult[0];

      const newDate = fields.event_date || existingEvent.event_date;
      const newTime = fields.event_time || existingEvent.event_time;

      const inputDate = new Date(`${newDate}T${newTime}`);
      const now = new Date();

      if (isNaN(inputDate.getTime())) {
        return res.status(400).json({ message: 'Invalid event date or time format' });
      }

      if (inputDate < now) {
        return res.status(400).json({ message: 'Event date and time cannot be in the past' });
      }
    }

    const updates = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE eventdetails SET ${updates} WHERE id = ?`;

    await db.promise().query(sql, [...values, id]);

    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

