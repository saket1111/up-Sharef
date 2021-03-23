const browseBtn=document.querySelector(".browseBtn");
const fileInput=document.querySelector("#fileInput");
const bgProgress=document.querySelector(".bg-progress");
const percentDiv=document.querySelector("#percent");
const progressBar=document.querySelector(".progress-bar");
const progressContainer=document.querySelector(".progress-container");
const fileURL=document.querySelector("#fileURL");
const sharingContainer=document.querySelector(".sharing-container");
const copyBtn=document.querySelector("#copyBtn");
const axios = require('axios');
const emailForm=document.querySelector("#emailform");
const qs = require('qs');

//click browse button to open select files dialog
browseBtn.addEventListener("click",()=>{
    fileInput.click(); 
});

//on change in upload file fired
fileInput.addEventListener("change",()=>{ 
uploadImage();
});

copyBtn.addEventListener("click",()=>{
  fileURL.select()
  document.execCommand("copy")
})

emailForm.addEventListener("submit",(e)=>{
  e.preventDefault()
  sendEmail();
})

//upload image
const  uploadImage= ()=>{
  progressContainer.style.display= "block";
  let formData = new FormData();
  const file=fileInput.files[0];

  if(file){

formData.append('myfile',file);

axios.post('https://up-share.herokuapp.com/api/files',
    formData, {
      onUploadProgress,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  ).then(function (res) {
   console.log(res.data.file);
   showLink(res.data.file); 
  })
  .catch(function () {
    console.log('FAILURE!!');
  });
}
}
//show link
const showLink = (link)=>{
  emailForm[2].removeAttribute("disabled");
  fileInput.value="";
  emailForm[0].value="";
  emailForm[1].value="";
  progressContainer.style.display = "none";
  sharingContainer.style.display="block";
  fileURL.value=link;

}
//sendemail
const sendEmail=()=>{
  const url=fileURL.value;
  const formData={
    uuid:url.split("/").splice(-1,1)[0],
    emailTo:emailForm.elements["to-email"].value,
    emailFrom:emailForm.elements["from-email"].value
  };
  emailForm[2].setAttribute("disabled","true");
  axios.post('https://up-share.herokuapp.com/api/files/send',
    qs.stringify(formData), {
      headers:{
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
       }
    }
  ).then(function (res) {
   if(res.data.success)
   { sharingContainer.style.display="none";
     alert('email sent successfully');
   }
  })
  .catch(function (err) {
    alert(err.message);
  });

}

//upload progress monitor
const onUploadProgress = event => {
  const percentCompleted = Math.round((event.loaded * 100) / event.total);
  console.log('onUploadProgress', percentCompleted);
  bgProgress.style.width=`${percentCompleted}%`;
  percentDiv.innerText=`${percentCompleted}`;
  progressBar.style.transform=`scaleX(${percentCompleted/100})`;
};