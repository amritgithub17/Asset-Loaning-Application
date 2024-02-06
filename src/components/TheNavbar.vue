<template>
  <div>
    <nav class="navbar">
      <div class="container">
        <img
          src="../Assets/logo.png"
          alt="User Image"
          class="user-image"
        />
        <!-- <div class="nav-content"> -->
        <!-- <h2>MS SOLUTIONS</h2> -->
        <div class="buttons">
          <button
          v-if="showCreateTransactionButton"
          id="btn"
            @click="showForm"
          >
            Create Transaction
          </button>
        </div>
          <loan-asset v-if="isVisible" :users="users" :assets="assets" @savedata = "saveData" @changedata="changeData" ></loan-asset>

          <select class="newDropdown" v-model="selectedUser" @change="emitSelectedUser">
            <option disabled selected value="">Select User</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.firstName + ' '}}{{ user.lastName }}({{ user.role }})
            </option>
          </select>
       <!-- </div>  -->
      </div>
    </nav>
  </div>
</template>

<script>
import LoanAsset from './LoanAsset.vue';
export default {
  components:{
    LoanAsset,
  },
  data() {
    return {
      isShow: 'Supervisor',
      isVisible: false,
      users: [],
      temp:null,
      assets:[],
      selectedUser: '',
    };
  },
  computed: {
    selectedUserRole() {
      const user = this.users.find(u => u.id === this.selectedUser);
      return user ? user.role : '';
    },
    showCreateTransactionButton() {
      // Check if the selected user is a supervisor
      const selectedUser = this.users.find(
        (user) => user.id === this.selectedUser
      );
      return selectedUser && selectedUser.role === 'Supervisor';
    },
  },
  methods: {
    changeData(value)
    {
      console.log(value);
      this.isVisible=false;
    },
    saveData(value)
    {
      this.isVisible=false;
      this.temp=value;
      console.log(this.temp);
      this.$emit('passingData',this.temp);
    },
    compareAsset(a,b)
    {
      if(a.assetName > b.assetName)
      {
        return 1;
      }
      else
      {
        return -1
      }
    },
    loadAsset() {
      fetch('http://localhost:3000/assets')
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          // console.log(data);
          const results = [];
          for (const id in data) {
            results.push({
              id: data[id].id,
              assetName: data[id].name,
              serialNumber: data[id].serialNumber,
              model: data[id].model,
            });
          }
          this.assets = results;
          this.$emit('passingParent',this.assets.sort(this.compareAsset));
        });
      

    },
    // compareUser(a,b)
    // {
    //   if(a.firstName > b.firstName)
    //   {
    //     return 1;
    //   }
    //   else{
    //     return -1;
    //   }
      
    // },
    loadUser() {
      fetch('http://localhost:3000/users')
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          const userData = [];
          for (const id in data) {
            // console.log("this is " + data[id].firstName+data[id].lastName+data[id].role+"!")
            userData.push({
              id: data[id].id,
              userId:data[id].id,
              firstName: data[id].firstName,
              lastName: data[id].lastName,
              role: data[id].role,
            });
          }
          this.users = userData
          this.$emit('transferUser',this.users);
          this.selectedUser = this.users[450].id;
          this.emitSelectedUser();
        });
        
       
    },
    
    showForm() {
      console.log('hello');
      this.isVisible = true;
     
    },
    emitSelectedUser() {
      console.log(this.selectedUser)
      this.$emit('selected-user-id', this.selectedUser);
    },
    
  },
  mounted() {
    this.loadUser();
    this.loadAsset();
    
    
  },
 
};
</script>

<style scoped>

.newDropdown{
  width: 20%;
    margin-right: 31px;
    height: 30px;
    border-radius: 10px;
}
.navbar {
  background-color: #d6e4e5;
    overflow: hidden;
    margin: -8px -8px;
    box-shadow: 0 7px 5px #C2C6C7;
    height: 85px;

  
}

.container {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  padding: 0 5px;
  margin-top: 20px;
  /* position:relative ; */
}

.container h2 {
  margin-right: 450px;
  margin-left: 0px;
}
.container img {
  margin-right: auto;
    margin-left: 40px;
    height: 46px;
    width: 133px;
    margin-top: 1px;
    
}
/* Style for the button */
.buttons {
  display: flex;
  align-items: center;
}
.buttons button {
  padding: 10px 20px;
    margin-right: 10px;
    border: none;
    cursor: pointer;
    border-radius: 10px;
    background-color: #497173;
    color: white;
}

/* Active button style */
.buttons button.active {
  background-color: #3f0fee;
  color: white;
  margin-top: 10px;
  height: 40px;
  border-radius: 10px;
}

/* DropDown Button Design */
/* Resetting default styles */
.custom-dropdown {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  /* padding: 10px 20px; */
  padding: 10px 40px 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  outline: none;
  margin-top: 10px;
  margin-left: 10px;
  position: relative; /* To position the arrow */
}

/* Styling the dropdown arrow */
/* .custom-dropdown::after { */
  /* content: '\25BC'; Unicode for down arrow */
  /* position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  pointer-events: none;
} */

/* Hover and focus styles */
.custom-dropdown:hover,
.custom-dropdown:focus {
  border-color: #3f0fee;
}

/* Styles for options */
.custom-dropdown option {
  background-color: #fff;
  color: #333;
}
/* Styles for the default disabled option */

/* LOAN ASSET FORM */
.overlay {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.322);
  justify-content: center;
  align-items: center;
}

</style>
