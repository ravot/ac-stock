import { Selector, ClientFunction } from "testcafe";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: '',
           pass: ''
       }
   });
   
   const mailOptions = {
    from: 'notificationReceived@gmail.com', // sender address
    to: 'notificationReceived@gmail.com', // list of receivers
    subject: 'LG1419IVSM Air Conditioner is in stock', // Subject line
    html: 'No HTML just text'// plain text body
  };
  

fixture `Check in-stock tests`;

const kiferRdStoreSelector = "#myStore";
const addToCartButtonSelector = "[data-target-atc='ATC']";
const howToGetItBoxSelector = "#buybelt-wrapper-new";
const notifyFailure = ClientFunction(() => {
    if (!("Notification" in window)) {
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification("OH LAWD!");
    }
    
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            var notification = new Notification("IT'S GOING DOWN");
        }
        });
    }
    
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.

});

test
    .page `https://www.homedepot.com/p/LG-Electronics-14-000-BTU-10-000-BTU-DOE-Portable-Air-Conditioner-Dual-Inverter-Quiet-Energy-Eff-Wi-Fi-with-LCD-Remote-in-White-LP1419IVSM/307296364`
    ("Home depot", async t => {
        var d = new Date();
        const dateInfo = new Date().toLocaleString("en-us", {timezone: "America/Los_Angeles"}).split("/").join("_").split(":").join("_").split(", ").join("_time_");
        const kiferRdStore = await Selector(kiferRdStoreSelector);
        const disabledAddToCartExists = await Selector(addToCartButtonSelector).withAttribute("disabled").exists;

        const location = await notifyFailure();

        await t
            .takeElementScreenshot(kiferRdStoreSelector, `screenshots/kiferRd_${dateInfo}.png`)
            .takeElementScreenshot(howToGetItBoxSelector, `screenshots/howToGetItBox_${dateInfo}.png`)
            .takeScreenshot({ path: `screenshots/page_${dateInfo}.png`})
            .expect(kiferRdStore.innerText).contains("Kifer Rd")
            .expect(disabledAddToCartExists).notOk();

        t.ctx.passed = true;
        console.log("disabledAddToCartExists", disabledAddToCartExists);
    })
    .after(async t => {
        if (t.ctx.passed) {
            await transporter.sendMail(mailOptions, function (err, info) {
                if(err)
                  console.log(err)
                else
                  console.log(info);
             });
        }

        t.ctx.passed = false;
         return await t;
    });
