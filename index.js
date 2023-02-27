const express=require("express")
const cors=require("cors")
const User=require("./config")
let error=""
const app=express()
const midtransClient = require('midtrans-client');
const { response } = require("express")
app.use(express.json())
app.use(cors());
var idmen = ""
// Create Core API instance
let coreApi = new midtransClient.CoreApi({
        isProduction : true,
        serverKey : 'Mid-server-6TquJSqBkFtBP5zE6TnOmBF2',
        clientKey: "Mid-client-NzLXWIPt0N12tHVV"
        // clientKey : 'SB-Mid-server-M382WCzXVOmwNjGjTuy0Uzkn'
    });

// var pushdata = []
app.post("/create", async(req,res)=>{
    const data=req.body
    console.log(data)
    // User.auth().createUserWithEmailAndPassword()

    // await User.firestore().collection("Data User").add(data)
    // res.send("Data Berhasil Didaftarkan")

    await User.auth().createUserWithEmailAndPassword(data.email, data.password).then(async(datadaftar)=>{
        // return res.status(200).json(datadaftar)
        console.log(datadaftar.user.uid)
        await User.firestore().collection("Data User").doc(datadaftar.user.uid).set(data)
        res.send("Data Berhasil Didaftarkan")
    }).catch(function (error){
        // let errorcode = error.code;
        // let errorMessage = error.message;
        // if(errorcode === ""){
        console.log(error)
        // }
        res.send("ADA KESALAHAN SILAHKAN COBA LAGI")
    })
    // // await User.auth().createUserWithEmailAndPassword(data.nama, data.alamat).catch(function(error){
    // //    res.send(error)
    // //    console.log(error)

    // // });



})

app.post("/login", async(req,res)=>{
    const data=req.body
    console.log(data)
    // User.auth().createUserWithEmailAndPassword()
    await User.auth().signInWithEmailAndPassword(data.nama, data.alamat).then(async(login)=>{
        console.log(login.user.uid)
        res.send({uid:login.user.uid,data:"BERHASIL LOGIN"})
    })
    .catch(function(error){
       res.send("ADA KESALAHAN COBA LAGI")
       console.log("TESSSS")
      
    });
    // await User.firestore().collection("Data User").doc(`${data.nama}`).set(data)
})

app.post("/logout", async(req,res)=>{
    const data=req.body
    console.log(data)
    const user = User.auth().currentUser;
    console.log(user)
    if(user){
        await User.auth().signOut()
        res.send("AKUN TERLOGOUT")
    }
})

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get("/get", async(req,res)=>{
    const snapshot = await User.firestore().collection("Tagihan").get();
    const list = snapshot.docs.map((doc)=>({idku:doc.id,...doc.data()}))
    // const app = snapshot.docs.map((doc)=>({halo:doc.id}))
    console.log(list)
    // console.log(list)
    res.send(list);
})

app.post("/cekuser", async(req,res)=>{
    const coba = req.body.id;
    // // const id = "hztYxzVeMUWjF9YjLWLW9zHr3L42";
    const snapshot = await User.firestore().collection("Data User").doc(coba).get();
    // const list = snapshot.map((doc)=>({id:doc.id,...doc.data()}))
    console.log(coba)
    res.send(snapshot.data());
})

app.post("/ambildataperuser", async(req,res)=>{
    const coba = req.body.id;
    // // const id = "hztYxzVeMUWjF9YjLWLW9zHr3L42";
    const snapshot = await User.firestore().collection("Data User").doc(coba).collection("Tagihan").get();
    // const list = snapshot.map((doc)=>({idku:doc.id,...doc.data()}))
    const list = snapshot.docs.map((doc)=>({idku:doc.id,...doc.data()}))
    console.log(coba)
    res.send(list);
})

app.put("/update", async (req,res)=>{
    const id = req.body.id;
    const idku = req.body.idku;
    const data = req.body;
    // console.log(data.tagihan)
    await User.firestore().collection("Data User").doc(id).collection("Tagihan").doc(idku).update({
        "nama":data.nama,
        "nominal":data.nominal,
        "alamat":data.alamat,
        // "status":data.status,
    });
    await User.firestore().collection("Tagihan").doc(idku).update(data);
    await User.firestore().collection("Data User").doc(id).update({
        "nama":data.nama,
        "alamat":data.alamat
    });
    res.send("Data Di Update")
})

app.post("/addtagihan", async (req,res)=>{
    const id = req.body.id;
    const data = req.body;
    console.log(req.body)
    console.log(req.body.id)

    const halo = await User.firestore().collection("Data User").doc(id).collection("Tagihan").add(data);
    const iddoctagihan = halo.id
    await User.firestore().collection("Tagihan").doc(iddoctagihan).set(data)
    // console.log(req.body.email)
    // const uid = "s1P5a2dJQcTqDLcKxG5raEtNK1E3";
    // await User.auth().delete(uid)
    res.send({msg: "Tagihan Ditambahkan"})
})


app.get("/cobasaja", async (req,res)=>{
    // const id = req.body.id;
    // const data = req.body;
    const halo = await User.firestore().collection("Data User").where("role", "==", "client").get();
    const list = halo.docs.map((doc)=>({idku:doc.id,...doc.data()}))
    console.log(list)
    res.send(list)
})  

app.post("/hapus", async (req,res)=>{
    const id = req.body.idku;
    const idhai = req.body.id;
    console.log(req.body)
    console.log(req.body.id)
    await User.firestore().collection("Tagihan").doc(id).delete();
    await User.firestore().collection("Data User").doc(idhai).collection("Tagihan").doc(id).delete();
    // console.log(req.body.email)
    // const uid = "s1P5a2dJQcTqDLcKxG5raEtNK1E3";
    // await User.auth().delete(uid)
    res.send({msg: "Data Terhapus"})
})

// app.get("/", async(req,res)=>{
//     const snapshot = await User.get();
//     snapshot.forEach(element => {
//         console.log(element.data())
//         pushdata.push(element.data())
//     });
//     res.send(pushdata)
// })


app.post("/bayar", async(req,res)=>{
    const data=req.body
    console.log(data.transaction_details.order_id)
    console.log("INI ID USER", data.id_user)
   await coreApi.charge(data).then(async (responseMidtrans)=>{

         console.log('chargeResponse:', JSON.stringify(responseMidtrans));
        // console.log('Status Message:', responseMidtrans.chargeResponse.status_message);
        // await User.firestore().collection("Pembayaran").add({responseMidtrans})
        const id = await User.firestore().collection("Pembayaran").doc(data.transaction_details.order_id).set({responseMidtrans})
        const halo = await User.firestore().collection("Data User").doc(data.id_user).collection("Tagihan").doc(data.transaction_details.order_id).update({
            "nomorva": responseMidtrans.va_numbers[0].va_number,
            "kondisi":true
        });
        
        // console.log(id.id)
        res.send({"responsedata":JSON.stringify(responseMidtrans), "status":"success"})
    }).catch((e)=>{
        // The request could not be completed due to a conflict with the current state of the target resource, please try again
        // Unable to create va_number for this transaction
        // Sorry. The bank/payment partner is experiencing some connection issues. Please retry later.
       console.log(JSON.stringify(e.ApiResponse))
       const pesan = JSON.stringify(e.ApiResponse)
       res.send({"status":"error", "responsedata":pesan})
    });
})

app.post("/ambilbayaran", async(req,res)=>{
    const data = req.body;
    const id = req.body.id;
    try {
    //    console.log(this.idmen)
       await coreApi.transaction.status(data.order_id).then(async (response)=>{
        console.log(response.transaction_status)
        console.log(data)
        if (response.transaction_status == "settlement"){
           await User.firestore().collection("Tagihan").doc(data.order_id).update({
            "status":"Lunas",
        });
           await User.firestore().collection("Data User").doc(id).collection("Tagihan").doc(data.order_id).update({
            "status": "Lunas",
        });
            await User.firestore().collection("Pembayaran").doc(data.order_id).update(response)
        }
        res.send({"status":"success","responsedata":JSON.stringify(response)})

        });
    } catch (error) {
        console.log(error)
        console.log("SEDANG ERROR")
        console.log(JSON.stringify(error.ApiResponse))
        const pesan = JSON.stringify(error.ApiResponse)
        res.send({"status":"error", "responsedata":pesan})
    }
    
})

// app.listen(4000, ()=>console.log("App Running port 4000"))

app.listen(process.env.PORT || 4000,()=>console.log("App Running Port 4000"))


