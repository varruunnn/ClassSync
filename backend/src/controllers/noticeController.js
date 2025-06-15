import Notice from '../models/Notice.js';

export const createNotice = async (req, res) => {
  try {
    const {
      title,
      content,
      type = 'info',
      status = 'draft',
      publishDate = Date.now(),
      expiryDate = null,
      targetAudience = 'all',
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }
    if (typeof req.schoolId !== 'number') {
      return res.status(400).json({ error: 'Invalid schoolId in token.' });
    }

    const notice = await Notice.create({
      title,
      content,
      type,
      status,
      publishDate,
      expiryDate,
      targetAudience,
      createdBy: req.userId,  
      schoolId: req.schoolId, 
    });

    return res.status(201).json({ message: 'Notice created.', notice });
  } catch (err) {
    console.error('createNotice error:', err);
    return res.status(500).json({ error: 'Server error while creating notice.' });
  }
};
// controllers/noticeController.js

export const listNoticesBySchool = async (req, res) => {
  try {
    const numericSid = Number(req.params.schoolId);
    if (isNaN(numericSid)) {
      return res.status(400).json({ error: 'Invalid schoolId parameter.' });
    }

    // pull the new `audience` param
    const { status, type, audience } = req.query;
    const filter = { schoolId: numericSid };

    // existing filters
    if (status && ['draft', 'published'].includes(status)) {
      filter.status = status;
    }
    if (type && ['info', 'warning', 'success'].includes(type)) {
      filter.type = type;
    }

    // if `audience` is provided, match either exactly or “all”
    if (audience) {
      const aud = String(audience);
      if (['all','teachers','students','parents'].includes(aud)) {
        // match docs whose targetAudience is either “all” or exactly the requested audience
        filter.targetAudience = { $in: ['all', aud] };
      } else {
        return res.status(400).json({ error: 'Invalid audience parameter.' });
      }
    }

    const notices = await Notice.find(filter)
      .sort({ publishDate: -1 })
      .populate('createdBy', 'name email');

    return res.json({ notices });
  } catch (err) {
    console.error('listNoticesBySchool error:', err);
    return res.status(500).json({ error: 'Server error while fetching notices.' });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid notice ID.' });
    }

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found.' });
    }
    if (notice.schoolId !== req.schoolId) {
      return res.status(403).json({ error: 'Forbidden: wrong school.' });
    }

    await Notice.findByIdAndDelete(id);
    return res.json({ message: 'Notice deleted.' });
  } catch (err) {
    console.error('deleteNotice error:', err);
    return res.status(500).json({ error: 'Server error while deleting notice.' });
  }
};
