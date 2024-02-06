

<template>
  <div class="container">
    <br>
    <div class="form-group">
      <div class="input-group">
        <label for="assetSelect"><strong>Asset</strong></label>
        <select id="assetSelect" v-model="selectedAsset" @change="emitFilters">
          <option value="" selected >Select Asset</option>
          <option v-for="asset in assets" :key="asset.id" :value="asset.assetName">{{ asset.assetName }}</option>
        </select>
      </div>

      <div class="input-group">
        <label for="userSelect" id="uniqueFilter" :style="{marginLeft:role === 'Student'?'-60px':''}"><strong>{{ role === 'Supervisor'?'User':'Supervisor' }}</strong></label>
        <select id="userSelect" v-model="selectedPerson" @change="emitFilters">
          <option value="" selected >{{ role === 'Supervisor'?'Select User':'Select Supervisor' }}</option>
          <option v-for="user in selectedUser" :key="user.id" :value="user.firstName  +' '+ user.lastName">{{ user.firstName + ' '}} {{ user.lastName }}</option>
        </select>
      </div>

      <div class="input-group">
        <label for="dateInput"><strong>Date</strong></label>
        <input type="date" id="dateInput" v-model="selectedDate" @change="emitFilters"> 
      </div>
    </div>
  </div>
</template>
<script>
export default{
    props:['users','assets','role','selectedId'],
    emits:['sendFilter'],
    data()
    {
        return{
           selectedUser:{},
           selectedAsset:'',
           selectedPerson:'',
           selectedDate:''
        }
    },
    watch:
    {
        role(val)
        {
            console.log(val);
            this.storeData();
            // this.selectedAsset = '';
            // this.selectedPerson=''
        },
        selectedId(val)
        {
          console.log(val);
          this.storeData();
          this.selectedAsset = '';
          this.selectedPerson = '';
          this.selectedDate = '';
        }
        
    },
    
    methods:
    
    {
    
      emitFilters() {
      this.$emit('sendFilter', {
        selectedAsset: this.selectedAsset,
        selectedPerson: this.selectedPerson,
        selectedDate: this.selectedDate

      });
    },
       showData()
       {
        console.log(this.selectedAsset,this.selectedPerson,this.selectedDate)
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
       storeData()
       {
        if(this.role === 'Supervisor')
        {
            this.selectedUser = this.users.filter((user)=>{
                return user.role === 'Student'
            }).sort(this.compareUser)
            
        }
        else if(this.role === 'Student')
        {
            this.selectedUser = this.users.filter((user)=>{
                return user.role === 'Supervisor'
            }).sort(this.compareUser)
        }
        // if(this.selectedAsset || this.selectedPerson || this.selectedDate)
        // {
        //     this.$emit('transferdata',{
        //     selectedAsset:this.selectedAsset,
        //     selectedPerson:this.selectedPerson,
        //     selectedDate:this.selectedDate,
        // })
        // }
        
       }
    },
  

    
}</script>

<style scoped>

.container {
  margin-top: 40px;
  margin-left: 40px;
}

.form-group {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Align items to start of the flex container */
  max-width: 600px; /* Adjust as needed */
  
}

.input-group {
  display: flex;
  flex-direction: column; /* Labels above, selects below */
  align-items: center; /* Center horizontally within the column */
}

label {
    margin-bottom: 5px;
    margin-left: -106px;
}

select,
input[type="date"] {
    width: 150px;
    padding: 5px;
    border-radius: 9px;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px #D1D5DE;
    outline: none;
    height: 26px;
}

select,
input[type="text"]{
    height: 35px;
}
</style>
