<template>
     <div class="overlay">
      <div id="overlay" class="overlay">
        <div class="form-container">
          <form  >
            <h1>EDIT ASSET</h1>
            <label for="fname">LoaningSupervisor</label>
            <select id="country" name="country" v-model="loaningSupervisorid">
            <option value="" disabled selected>{{ selectedSupervisor }}</option>
            <option v-for="supervisor in supervisors" :key="supervisor.id" :value="supervisor.id">{{ supervisor.firstName + ' '}} {{ supervisor.lastName }}</option>
          </select>
            
  
            <label for="lname">Student</label>
            <select id="country" name="country" v-model="studentid">
            <option value=""  selected>{{ selectedStudent }}</option>
            <option v-for="student in students" :key="student.id" :value="student.id">{{ student.firstName + ' '}} {{ student.lastName }}</option>
            </select>
  
            <label for="country">Asset</label>
            <select id="country" name="country" v-model="assetid">
            <option value="" disabled selected>{{ selectedAsset }}</option>
            <option v-for="asset in assets" :key="asset.id" :value="asset.id">{{ asset.assetName }}</option>
            </select>
            <div class="input-group">
            <label for="date" id="uniqueLabel">Issue Date</label>
            <input type="date" class="Date" v-model="issuedate"/>
            </div>

           
            <button class="formButton" @click="cancelEdit" type="button">Cancel</button>
            <button id="unique" class="formButton" @click="saveEditData">Save</button>
            
          </form>
        </div>
      </div>
    </div>
</template>
<script>
export default{
  props:['selectedStudent','selectedAsset','selectedSupervisor','selectedSupervisorId','selectedAssetId','selectedStudentId','transactionId','issueDate','users','assets'],

  data()
  {
    return{
      supervisors:[],
      students:[],
      loaningSupervisorid:this.selectedSupervisorId,
      loaningSupervisor:'',
      studentid:this.selectedStudentId,
      student:'',
      assetid:this.selectedAssetId,
      asset:'',
      issuedate:this.convertDate(this.issueDate),
    }
  },
  methods:{
    convertDate(value) {
      const parts = value.split('-'); // Split the date string by '-'
  
  // Re-arrange the parts to create a new date string in "YYYY-MM-DD" format
  const formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  
  return formattedDate;
    },
    // convertDateAgain(value)
    // {
    //   const isoDate = value;
    //   const date = new Date(isoDate);

    //   const day = date.getUTCDate().toString().padStart(2, '0');
    //   const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    //   const year = date.getUTCFullYear();

    //   const formattedDate = `${day}-${month}-${year}`;
    //   return formattedDate;
    // },
    cancelEdit()
    {
      this.$emit('canceledit',false);
    },
    seperateUsers()
      {
        // console.log("Users",this.users);
        for(const user of this.users)
        {
          // console.log("INSIDE") 
          if(user.role === 'Supervisor')
          {
            
            this.supervisors.push({
              id:user.id,
              firstName : user.firstName,
              lastName : user.lastName
            })
          }
          else if(user.role === 'Student')
          {
            this.students.push({
              id:user.id,
              firstName : user.firstName,
              lastName : user.lastName
            })
          }
        }
        // console.log("Supervisors",this.supervisors)
      },
      findId()
      {
        // console.log(this.loaningSupervisorName,this.studentname,this.assetname)
        this.loaningSupervisor = this.supervisors.find((supervisor)=>{
          return supervisor.id === this.loaningSupervisorid;
        })

        this.student = this.students.find((student)=>{
          return student.id === this.studentid;
        })

        this.asset = this.assets.find((asset)=>{
          return asset.id === this.assetid;
        })
        console.log(this.loaningSupervisor,this.student,this.asset);
      },
      saveEditData()
      {
        this.findId();
        const obj = {
          transactionId:this.transactionId,
          loaningSupervisorId:this.loaningSupervisorid,
          loaningSupervisorname:this.loaningSupervisor.firstName+' '+this.loaningSupervisor.lastName,
          studentId:this.student.id,
          studentname:this.student.firstName+' '+this.student.lastName,
          assetId:this.assetid,
          assetName:this.asset.assetName,
          issueDate:this.issuedate,
        }
        
        this.$emit('saveeditdata',obj);
       
      }
  },
  mounted()
  {
    this.seperateUsers();
  }
}
 
</script>
<style scoped>
#uniqueLabel{
  margin-left: -200px;
    margin-top: 10px;
    margin-bottom: 8px;
}
.input-group {
  display: flex;
  flex-direction: column; /* Labels above, selects below */
  align-items: center; /* Center horizontally within the column */
}
.Date {
  width: 98%;
    height: 27px;
    border-radius: 5px;
}
h1{
    font-size: 18px;
  }
  label{
    font-size: 14px;
  }
  .overlay {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.16);
    justify-content: center;
    align-items: center;
  
    backdrop-filter: blur(3px); /* Change the value for desired blur amount */
    -webkit-backdrop-filter: blur(5px); /* For some older browsers */
  }
  .form-container {
    background-color: white;
    padding: 14px;
    border-radius: 15px;
    height: 393px;
    width: 257px;
    margin-top: 15px;
  }
  .formButton {
    padding: 12px 20px;
    margin-right: 10px;
    border: none;
    cursor: pointer;
    width: 46%;
    border-radius: 5px;
    margin-top:17px;
  }
  #country {
    margin-bottom: 10px;
  }
  input[type='text'],
  #country,
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 6px;
    margin-bottom: 8px;
    resize: vertical;
    font-size: 12px;
  }
  
  input[type='submit'] {
    background-color: #04aa6d;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  input[type='submit']:hover {
    background-color: #45a049;
  }
  
  .input-container {
    display: flex;
    flex-direction: column;
    margin-right: 80px;
  }
  #unique {
    background-color: #5e9ba0;
  }
  .date {
    margin-right: 100px;
    margin-bottom: 10px;
  }
  option {
    color: black;
  }
</style>