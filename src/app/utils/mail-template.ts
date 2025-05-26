const HTML_TEMPLATE = (
  name: string,
  email: string,
  status: "APPROVED" | "REJECTED",
  leaveDetails: {
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
  }
) => {
  const statusColor = status === "APPROVED" ? "#4CAF50" : "#F44336";
  const statusText = status === "APPROVED" ? "Approved" : "Rejected";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Leave Application ${statusText}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: ${statusColor};
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
          }
          .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #888888;
            text-align: center;
            border-top: 1px solid #eeeeee;
            padding-top: 10px;
          }
          h3 {
            color: #333333;
          }
          p {
            color: #555555;
            line-height: 1.6;
          }
          .details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
          }
          .details p {
            margin: 8px 0;
          }
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            background-color: ${statusColor};
            color: white;
            font-weight: bold;
            margin-bottom: 15px;
          }
          .comments {
            background-color: #fff8e1;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Leave Application Update</h2>
            <p>Your leave request has been processed</p>
          </div>
          <div class="content">
            <h3>Dear ${name},</h3>
            
            <div class="status-badge">
              ${statusText}
            </div>
            
            <p>Your leave request has been <strong>${statusText.toLowerCase()}</strong> by the HR department.</p>
            
            <div class="details">
              <p><strong>Leave Type:</strong> ${leaveDetails.type}</p>
              <p><strong>Dates:</strong> ${leaveDetails.startDate} to ${
    leaveDetails.endDate
  }</p>
              <p><strong>Reason:</strong> ${leaveDetails.reason}</p>
      
            </div>
            
            ${
              status === "APPROVED"
                ? `
              <p>Your leave has been approved. Please make necessary arrangements for your absence.</p>
            `
                : `
              <p>Unfortunately your leave request could not be approved. Please contact HR if you have any questions.</p>
            `
            }
            
            <p>Best regards,</p>
            <p>Human Resources Department</p>
          </div>
          <div class="footer">
            <p>This is an automated notification. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export default HTML_TEMPLATE;

//const HTML_TEMPLATE = (name: string, email: string, message: string) => {
//   return `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Contact Message Notification</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               background-color: #f4f4f4;
//               margin: 0;
//               padding: 0;
//             }
//             .container {
//               max-width: 600px;
//               margin: 20px auto;
//               background-color: #ffffff;
//               padding: 20px;
//               border-radius: 8px;
//               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//             }
//             .header {
//               background-color: #4CAF50;
//               color: #ffffff;
//               padding: 10px;
//               text-align: center;
//               border-radius: 8px 8px 0 0;
//             }
//             .content {
//               padding: 20px;
//             }
//             .footer {
//               margin-top: 20px;
//               font-size: 0.9em;
//               color: #888888;
//               text-align: center;
//             }
//             .content h3 {
//               color: #333333;
//             }
//             .content p {
//               color: #555555;
//               line-height: 1.6;
//             }
//             .details {
//               background-color: #f9f9f9;
//               padding: 15px;
//               border-radius: 5px;
//               margin: 10px 0;
//             }
//             .details p {
//               margin: 5px 0;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h2>New Contact Message</h2>
//             </div>
//             <div class="content">
//               <h3>Hello Admin,</h3>
//               <p>You have received a new message from the contact form on your website:</p>
//               <div class="details">
//                 <p><strong>Name:</strong> ${name}</p>
//                 <p><strong>Email:</strong> ${email}</p>
//                 <p><strong>Message:</strong></p>
//                 <p>${message}</p>
//               </div>
//               <p>Please respond to this inquiry at your earliest convenience.</p>
//               <p>Best regards,</p>
//               <p>Your Website Team</p>
//             </div>
//             <div class="footer">
//               <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `;
// };

// export default HTML_TEMPLATE;
