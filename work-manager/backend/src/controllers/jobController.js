const Job = require('../models/Job');

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('tools')
      .populate('agent')
      .populate('prompts');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('tools')
      .populate('agent')
      .populate('prompts');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new job
exports.createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Execute job (placeholder for future implementation)
exports.executeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('tools')
      .populate('agent')
      .populate('prompts');
      
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // This is a placeholder for future job execution logic
    // In a real implementation, this would handle the actual job execution
    
    res.status(200).json({ 
      message: 'Job execution initiated',
      jobId: job._id,
      status: 'pending'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 