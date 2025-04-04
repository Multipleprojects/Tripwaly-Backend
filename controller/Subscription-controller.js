const Subscription = require('../models/Subscription'); // Adjust path as necessary
                  
//create method
exports.createSubscription = async (req, res) => {
  try {
    const { email } = req.body;
    // Find existing subscription by email and user
    let subscription = await Subscription.findOne({ email });
    if(subscription)
    {
      return res.status(400).json({ message: "Subscription already exists" });
    }
    if (!subscription) {
      // If subscription does not exist, create a new one
      subscription = new Subscription({ email});
      await subscription.save();
      res.status(201).json({ message: 'Subscription created successfully', subscription });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating subscription', error });
  }
};
//get method
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error });
  }
};
//get by id method
exports.getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription', error });
  }
};
//update ethod
exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const subscription = await Subscription.findByIdAndUpdate(id, updatedData, { new: true });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json({ message: 'Subscription updated successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription', error });
  }
};


//delete method
exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndDelete(id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subscription', error });
  }
};
