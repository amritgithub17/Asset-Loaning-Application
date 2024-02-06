<template>
  <div class="overlay">
    <div id="overlay" class="overlay">
      <div class="form-container">
        <form  >
          <h1>LOAN ASSET</h1>
          <label for="fname">LoaningSupervisor</label>
          <select id="country" name="country" v-model="loaningSupervisorid ">
            <option value="" disabled selected>Select an option</option>
            <option v-for="supervisor in supervisors" :key="supervisor.id"  :value="supervisor.supervisorId">{{ supervisor.supervisorfirstName + ' '}}{{ supervisor.supervisorlastName }}</option>
          </select>

          <label for="lname">Student</label>
          <select id="country" name="country" v-model="studentid">
            <option value="" disabled selected>Select an option</option>
            <option v-for="student in students" :key="student.id" :value="student.studentId">{{ student.firstName+' ' }}{{ student.lastName }}</option>
          </select>

          <label for="country">Asset</label>
          <select id="country" name="country" v-model="assetid">
            <option value="" disabled selected>Select an option</option>
            <option  :value="asset.id" v-for="asset in assets" :key="asset.id">
              {{ asset.assetName }}
            </option>
          </select>
          
          <label for="date">Select Date</label>
          <input type="date" class="date" v-model="date" />
          <button type="button" @click="changeVisible" class="formButton">
            Cancel
          </button>
          <button id="unique" class="formButton" @click="saveData($event)">Save</button>
          
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import { uuidv4 } from 'uuid';

export default {
  props: ['users','assets'],
  inject:['rerender'],
  data() {
    return {
      students: [],
      supervisors: [],
      loaningSupervisorid: '',
      studentid : '',
      assetid : '',
      date : null,
      assetId : '',
      model: '',
      transactionId:this.uuidv4(),
    };
  },
  methods: {
   

    changeVisible()
    {

      this.$emit('changedata',false);
    },
    uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
},
    compareUser(a,b)
    {
      if(a.firstName > b.firstName)
      {
        return 1;
      }
      else
      {
        return -1;
      }
    },
    storeUser() {
      // console.log("USERS" , this.users);
      const localUser = this.users;
      for (const id in localUser) {
        if (localUser[id].role === 'Supervisor') {
          this.supervisors.push({
            id: id,
            supervisorId:localUser[id].userId,
            supervisorfirstName: localUser[id].firstName,
            supervisorlastName: localUser[id].lastName,
          })
          // this.supervisors.sort(this.compareUser)
        }
        else if(localUser[id].role === 'Student'){
          this.students.push({
            id: id,
            studentId:localUser[id].userId,
            firstName: localUser[id].firstName,
            lastName: localUser[id].lastName,
          })
          this.students.sort(this.compareUser)
        }
      }
    },
    saveData()
    {
      // event.preventDefault()
      // console.log("SAVE DATA ")
      const selectedAsset = this.assets.find(asset => {
    // console.log('Asset assetName:', asset.assetName,this.assetName);
    return asset.id=== this.assetid;
  });
  const selectedStudent = this.students.find(student => {
    return student.studentId === this.studentid;
  })
  const selectedSupervisor = this.supervisors.find(supervisor => {
    return supervisor.supervisorId === this.loaningSupervisorid;
  })

  console.log('Selected asset:', selectedAsset);
  // console.log('Selected Student', selectedStudent);
  // console.log('Loaning Superviosr Name',selectedSupervisor)
      if(selectedAsset && selectedStudent && selectedSupervisor)
      {
        var {assetName} = selectedAsset;
        var {firstName,lastName} = selectedStudent;
        var {supervisorfirstName,supervisorlastName} = selectedSupervisor;
        console.log(assetName)
        
        const obj = {
          "id" : this.transactionId,
          "transactionType" : 'Loan',
          "loaningSupervisorId" : this.loaningSupervisorid,
          "loaningSupervisorname": supervisorfirstName+' '+supervisorlastName,
          "studentId" : this.studenid,
          "studentname" : firstName+' '+lastName,
          "assetId": this.assetid,
          "assetName":assetName,
          "loanDate" : this.date,
          "receivingSupervisorId":null,
          "receivingSupervisorname":null,
          "returnDate": null

        }
        console.log(obj);
        this.$emit('savedata',obj);
       

      }
      
    }
    
  },
  mounted() {
    this.storeUser();
  },
};
</script>

<style scoped>
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
  height: 400px;
  width: 270px;
  margin-top: 15px;
  
}
.formButton {
  padding: 12px 20px;
  margin-right: 10px;
  border: none;
  cursor: pointer;
  width: 46%;
  border-radius: 5px;
  
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
  margin-bottom: 16px;
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

input.date {
  width: 100%;
    height: 25px;
    border-radius: 5px;
    margin-top: 8px;
    margin-bottom: 13px;
    border: 1px solid #ccc;
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
