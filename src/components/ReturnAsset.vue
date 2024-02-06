<template>
    <div class="overlay">
      <div id="overlay" class="overlay">
        <div class="form-container">
          <form  >
            <h1>RETURN ASSET</h1>
            <label for="fname">LoaningSupervisor</label>
            <input type="text" :value="selectedSupervisor" readonly>
  
            <label for="lname">Student</label>
            <input type="text" :value="selectedStudent" readonly>
  
            <label for="country">Asset</label>
            <input type="text" :value="selectedAsset" readonly>
            <label for="date">Issue Date</label>
            <input type="text" :value="issueDate"  readonly>

            <label>ReceivingSupervisor</label>
            <select id="country" name="country" @click="loadSupervisor" v-model="receivingSupervisor" >
              <option value="" disabled selected>Select</option>
              <option v-for="supervisor in supervisors" :key="supervisor.id" :value="supervisor.id">{{ supervisor.firstName + ' '}} {{ supervisor.lastName }}</option>
            </select>
            
            <div class="input-group">
            <label for="date" id="uniqueLabel">Return Date</label>
            <input type="date" class="Date" v-model="returnDate"/>
            </div>
            
            <button class="formButton" type="button" @click="changeCancel">Cancel</button>
            <button id="unique" class="formButton" @click="saveFormData">Save</button>
            
          </form>
        </div>
      </div>
    </div>
  </template>


  <script>
  export default {
    props:['selectedStudent','selectedAsset','selectedSupervisor','selectedSupervisorId','transactionId','issueDate','users'],
    data()
    {
      return {
        supervisors:[],
        receivingSupervisor:'',
        returnDate : '',
      }
    },
    emits:['formdata'],
    methods:{
      changeCancel()
      {
        this.$emit('changecancel',false);
      },
      saveFormData()
      {
        //event.preventDefault();
        // console.log(this.receivingSupervisor,this.returnDate)
        
        const temp = this.supervisors.find((supervisor)=>supervisor.id === this.receivingSupervisor)
        this.$emit('formdata',{
          id:this.transactionId,
          receivingSupervisor:temp.firstName+' '+temp.lastName,
          returnDate:this.returnDate,
        })
      },
      loadSupervisor()
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
        }
        // console.log("Supervisors",this.supervisors)
      }  
    }
  }
</script>


  <style scoped>
  #uniqueLabel{
  margin-left: -217px;
    margin-top: 10px;
    margin-bottom: 8px;
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
  height: 535px;
  width: 290px;
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

option {
  color: black;
}
  </style>