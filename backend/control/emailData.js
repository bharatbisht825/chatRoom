const nodemailer= require("nodemailer")

async function emailData(req,res) {
    const userDetails=req.body
    console.log(userDetails)
    
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "videochatcompany@gmail.com",
                pass: "oadskhsnvfkobbyz",
            },
        });

        

        const mailOptions = {
            from: "videochatcompany@gmail.com",
            to: userDetails.email,
            subject: `room key ${userDetails.key} with user keys ${userDetails.user.join(",")}`,
            text: "hh",
        };

        // Send email with OTP
        res.json(await transport.sendMail(mailOptions));
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

module.exports=emailData