exports.GetMessage = (req, res) => {
    const message = "Database connected successfully! 🎉 with version: 1.0.0";
    

    res.status(200).json({ message });
};