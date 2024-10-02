import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
      message: 'Hello, this is a JSON response!',
      status: 'success',
      timestamp: new Date()
    });
});

export default router;