<template>
  <div v-if="DataLoaded">
    <the-header
      :users="users"
      :assets="assets"
      :role="selectedUser.role"
      :selectedId ='selectedId'
      @sendFilter="receiveData"
      
    ></the-header>
    <return-asset
      v-if="isReturnVal"
      :selectedStudent = "selectedStudentName"
      :selectedAsset = "selectedAssetName"
      :selectedSupervisor = "selectedSupervisorName"
      :selectedSupervisorId="loanSupervisor"
      :issueDate="date"
      :users="users"
      :transactionId="transactionId"
      @formdata="formData"
      @changecancel="changeCancel"
    ></return-asset>
    <edit-asset
      v-if="isEditVal"
      :selectedStudent = "selectedStudentName"
      :selectedAsset = "selectedAssetName"
      :selectedSupervisor = "selectedSupervisorName"
      :selectedSupervisorId="loanSupervisor"
      :selectedAssetId="device"
      :selectedStudentId="student"
      :issueDate="date"
      :users="users"
      :assets="assets"
      :transactionId="transactionId"
      @saveeditdata="saveEditData"
      @canceledit="cancelEdit"
    ></edit-asset>
    <div class="card-container" v-if="newFilteredTransactions.length > 0">
      <div
        class="card"
        
        v-for="trans in newFilteredTransactions"
        :key="trans.id"
        :class="{ expanded: selectedTransaction === trans.id }"
        :style="{
          borderColor:
              trans.expanded
              ? getBorderColor(trans)
              : 'transparent',
          height:trans.expanded?getNewHeight(trans.action):getHeight(trans.action),
          borderRadius:trans.expanded?'28px':'8px'
        }"
        @click="expandCard(trans)"
      >
      <!-- <div
            class="newCircle"
            v-if="trans.expanded"
            :style="{
              color: getCircleColor(trans.action),
            }"
          >
            <font-awesome-icon :icon="['fas', 'circle']" />
          </div> -->
        <div class="content" >
          <div
            class="circle"
             v-if="!trans.expanded"
            :style="{
              color: getCircleColor(trans.action),
              // marginLeft:trans.expanded?'20px':'228px',
            }"
          >
            <font-awesome-icon :icon="['fas', 'circle']" />
          </div>

          <img
            src="../Assets/MicrosoftTeams-image.png"
            alt="Photo"
            class="card-image"
            v-if="trans.expanded "
            :style="{marginBottom:trans.action === 'Loan'?'auto':'30px',
          }"
          />
          
          <div
            class="icon"
            :style="{backdropFilter:isEditVal || isReturnVal ?'':'opacity(0.5)'}"
            @click="saveEdit(trans)"
            v-if="
              trans.expanded && trans.action === 'Loan' && selectedUser.role === 'Supervisor'
              
            "
          >
            <font-awesome-icon :icon="['fas', 'pen-to-square']" />
          </div>

          <h6>{{ trans.id }}</h6>
          <h3><b>{{ trans.device }}</b></h3>
          <h4><b>{{ trans.user }}</b></h4>
          
          <button><strong>Issue Date: </strong>{{ trans.date }}</button>
          <button v-if="trans.returnDate ">
            <strong>Return Date : </strong>{{ trans.returnDate }}
          </button>
          <button><strong>Loaning supervisor: </strong>{{ trans.loanSupervisor }}</button>
          <button v-if="trans.expanded"><strong>Asset Id: </strong>{{ trans.assetId }}</button>
          <button v-if="trans.returnSupervisor && trans.expanded">
           <strong> R-supervisor:</strong> {{ trans.returnSupervisor }}
          </button> 
          
          <button v-if="trans.expanded">
            <strong>Model : </strong>{{ findModel(trans.assetId) }}
          </button>
          <!-- <button v-if="selectedUser.role === 'Supervisor' && trans.action === 'Loan'" ">Return</button> -->
          <div
          v-if="
              trans.expanded && trans.action === 'Loan' && selectedUser.role==='Supervisor'
              
            "
            @click="saveData(trans)"
            class="pen-container"
          >
            <font-awesome-icon :icon="['fas', 'file-arrow-down']" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="noData">
      <img
          class="noDataimg"
          src="../Assets/alien spaceship-rafiki 3.png"
          alt="No Data Available"
        />
        <p class="noDatatext">No Data Available!</p>
    </div>
  </div> 
  <div v-else class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
  </div>
  <!-- <div v-if="newTransactions.length === 0 && DataLoaded" class="noData">
        <img
          class="noDataimg"
          src="../Assets/alien spaceship-rafiki 3.png"
          alt="No Data Available"
        />
        <p class="noDatatext">No Data Available!</p>
      </div> -->
  
  
</template>

<script>
import ReturnAsset from './ReturnAsset.vue';
import TheHeader from './TheHeader.vue';
import EditAsset from './EditAsset.vue';

export default {
  data() {
    return {
      selectedUser: '',
      isReturnVal: false,
      isEditVal: false,
      loanSupervisor: '',
      student: '',
      device: '',
      date: '',
      transactionId: '',
      selectedTransaction: null,
      temp: '',
      filterAsset: '',
      filterPerson: '',
      filterDate: '',
      selectedSupervisorName:'',
      selectedAssetName:'',
      selectedStudentName:'',
      // componentKey:0,
      DataLoaded:false,
      filterSelectedAsset:'',
      filterSelectedPerson:'',
      
      
    };
  },
  components: {
    TheHeader,
    ReturnAsset,
    EditAsset,
  },
  // inject:['rerender'],
  props: ['filteredTransactions', 'assets', 'users', 'selectedId'],
  emits: ['passingformdata', 'passingeditformdata'],
  computed: {
    newFilteredTransactions() {
      let filtered = [...this.filteredTransactions];
      if (this.filterPerson !== '') {
        filtered = filtered.filter((trans) => 
        {
          if(this.selectedUser.role === 'Supervisor')
          {
            return trans.user === this.filterPerson
          }
          else if(this.selectedUser.role === 'Student')
          {
            return trans.loanSupervisor === this.filterPerson
          }
          
        });
      }
      if (this.filterAsset !== '') {
        filtered = filtered.filter(
          (trans) => trans.device === this.filterAsset
        );
      }

      if (this.filterDate !== '') {
        const formattedDate = this.formatDate(this.filterDate);
        filtered = filtered.filter((trans) => {
          console.log(formattedDate, trans.date);
          return trans.date === formattedDate;
        });
      }
      
      return filtered;
    },
  },
  
  methods: {
    // forceRerender()
    // {
    //   this.componentKey+=1;
    // },
    checkData(length)
    {
      console.log(length);
      if(length === 0)
      {
        this.DataFound = false;
      }
      // else
      // {
      //   this.DataFound = true;
      // }

    },
    getNewHeight(action)
    {
      return action === 'Loan'
        ? '29rem'
        : action === 'Return'
        ? '30rem'
        : ''; 
    },
    getHeight(action)
    {
      return action === 'Loan'
        ? '14rem'
        : action === 'Return'
        ? '14rem'
        : '';  
    },
    findModel(assetId)
    {
      if(assetId)
      { 
        const foundModel = this.assets.find((asset) => 
      {
        return asset.id=== assetId;
      });
      return foundModel.model;

      }
      else{
        return ''
      }
      
      
    },
    resetFilters() {
    this.filterAsset = '';
    this.filterPerson = '';
    this.filterDate = '';
    // this.forceRerender();
    
  },
    formatDate(value) {
      const isoDate = value;
      const date = new Date(isoDate);

      const day = date.getUTCDate().toString().padStart(2, '0');
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = date.getUTCFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      return formattedDate;
    },
    receiveData(value) {
      const { selectedAsset, selectedPerson, selectedDate } = value;

      this.filterAsset = selectedAsset;
      this.filterPerson = selectedPerson;
      this.filterDate = selectedDate;
      console.log("received data from cardList ",this.filterAsset, this.filterPerson, this.filterDate);
    },
    cancelEdit() {
      this.isEditVal = false;
    },
    changeCancel() {
      this.isReturnVal = false;
    },
    saveEdit(transaction) {
      this.isEditVal = true;
      const { loaningSupervisorId, userId, assetId, date, id } = transaction;
      this.transactionId = id;
      this.loanSupervisor = loaningSupervisorId;
      this.student = userId;
      this.device = assetId;
      this.date = date;
      const user = this.users.find((user)=>user.userId === userId)
      this.selectedStudentName = user.firstName+' '+user.lastName
      const asset = this.assets.find((asset)=>asset.id === assetId)
      this.selectedAssetName = asset.assetName
      const loaningSupervisor = this.users.find((user)=>user.userId === loaningSupervisorId);
      this.selectedSupervisorName = loaningSupervisor.firstName +' '+ loaningSupervisor.lastName

    },
    expandCard(transaction) {
      // this.selectedTransaction = transactionId;
      console.log("Inside a particular card",transaction.expanded)
      if(this.isEditVal === false && this.isReturnVal === false){transaction.expanded = !transaction.expanded;}
      console.log("Inside a particular card",transaction.expanded)
    },
    formData(value) {
      this.isReturnVal = false;
      this.temp = value;
      console.log('INSIDE FORM', value);
      this.$emit('passingformdata', value);
    },
    saveEditData(value) {
     this.isEditVal = false;
      this.$emit('passingeditformdata', value);
    },
    saveData(transaction) {
      this.isReturnVal = true;
      
      const { loaningSupervisorId, userId, assetId, date, id } = transaction;
      this.transactionId = id;
      this.loanSupervisor = loaningSupervisorId;
      this.student = userId;
      this.device = assetId;
      this.date = date;
      const user = this.users.find((user)=>user.userId === userId)
      this.selectedStudentName = user.firstName+' '+user.lastName
      const asset = this.assets.find((asset)=>asset.id === assetId)
      this.selectedAssetName = asset.assetName
      const loaningSupervisor = this.users.find((user)=>user.userId === loaningSupervisorId);
      this.selectedSupervisorName = loaningSupervisor.firstName + ' '+loaningSupervisor.lastName
      
    },
    filterUser() {
      console.log('Inside CardList');
      this.selectedUser =
        this.users.find((user) => user.userId === this.selectedId) || this.users;
        this.resetFilters();
      console.log("Inside card List" , this.selectedUser.role);
    },
    getBorderColor(transaction) {
      return transaction.action === 'Loan'
        ? '#EA643F'
        : transaction.action === 'Return'
        ? '#497173'
        : '';
    },
    getCircleColor(action) {
      return action === 'Loan'
        ? '#EA643F'
        : action === 'Return'
        ? '#497173'
        : 'transparent';
    },
  },
  watch: {
  
    selectedId(newVal) {
      console.log(newVal);
      // this.resetFilters();
      this.filterUser();
      // this.forceRerender();
      
      
    },
    filteredTransactions(val)
    {
      if(val)
      {
        this.DataLoaded = true;
      }
    }
    
  },
};
</script>

<style scoped>
.loading {
  text-align: center;
  padding-top: 150px;
}
 
.spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border-top: 3px solid #4fa2da;
  animation: spin 1s linear infinite;
  justify-content: center;
}
 
/* @keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} */
.noDataimg {
  width: 492px;
  padding-left: 400px;
  padding-top: -6px;
  margin-top: -20px;
}
 
.noDatatext {
  color: rgb(3, 75, 3);
  font-weight: bolder;
  font-size: 22px;
  padding-left: 560px;
  margin-top: -9px;
}
.newCircle{
  /* margin-left: 248px; */
  /* display: flex; */
  /* margin-top: 7px; */
  color: orange;
}
.circle {
  margin-left: 228px;
  display: flex;
  margin-top: 7px;
  color: orange;
  /* position: relative; */
}
.pen-container {
  width: 35px;
  height: 35px;
  background-color: rgb(255, 140, 0);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -18px;
  margin-left: 208px;
  /* margin-bottom: 5px; */
}

.icon {
  width: 35px;
    height: 35px;
    background-color: rgb(255, 140, 0);
    /* backdrop-filter: opacity(0.5); */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -136px;
    margin-left: 210px;
    margin-bottom: 132px;

}

/* .card-container {

  display: flex;
  gap: 20px;
    flex-direction: column;
    flex-wrap:wrap;
    align-content: flex-start;
    max-height: 200vh; 
    margin-top: 20px;
    position:relative;
    columns: 4;
    flex: 0 1 calc(16.666% - 20px); 
}

.card {
  width: calc(20% - -30px);
  
    margin: 10px;
    border: 1px solid #ccc;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    max-width: 300px;
    flex-wrap: wrap;
    
}
 */
/* .card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 55px; 

} */

.card-container {
  /* display: grid; */
  /* display: flex; */
  /* flex-wrap: wrap; */
  /* justify-content: space-between; */
  columns: 17rem auto;
  /* column-gap: 20px; */
  /* display: flex;
  flex-wrap: wrap; */
  margin-top: 40px;
  /* flex-direction: column; */
  margin-left: 35px;
  /* margin-right: 44px; */
}

.card {
  width: 270px;
  transition: height 0s ease-in-out;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  max-width: 300px;
  /* text-align: center; */
  font-family: arial;
  
  border: 2px solid transparent;
  /* align-items: left; */
  display: inline-block;
  flex-direction: column;
  background-color: white;
  /* height:auto; */
  box-sizing: border-box;
  margin-top: 20px;
  /* position: relative; */
  /* max-height: auto; */

  border-width: 2px; /* Set default border width */
  border-style: solid; /* Set default border style */
  transition: border-color 0.3s ease-in-out; /* Apply transition to border color */
}

/* .card img {
  
  width: 102%;
  margin-left: -6px;
  
  border-radius: 6px 6px 0 0;
} */

.card-image {
  width: 101%;
  height: 146px; /* Set a fixed height for the image */
  object-fit: cover; /* Maintain aspect ratio and cover the area */
  display: block;
  margin-left: -4px;
  margin-right: -8px;
  margin-top: 1px;
  border-top-left-radius: 23px;
  border-top-right-radius: 23px;
}

.card button {
  margin-bottom: 8px;
  margin-right: 6px;
  border-color: 1px white;
  height: 30px;
  border: 1px;
  border-radius: 10px;
  font-size: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 5px 4px rgba(0, 0, 0, 0.2);
}

.content {
  /* align-items: left; */
  align-self: flex-start;
  margin-left: 6px;
  flex-grow: 1;
  
  /* position: relative; */
}
h4 {
  margin-bottom: 18px;
  font-family:  'Roboto', sans-serif;
  font-weight: 800;
}
h3 {
  margin-bottom: -14px;
  margin-top: -13px;
  font-family:  'Roboto', sans-serif;
  font-weight: bolder;
}
h6 {
  margin-top: 12px;
  font-family:  'Roboto', sans-serif;;
}
</style>
