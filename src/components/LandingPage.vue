<template>
  <the-navbar
    @passingData="saveData"
    @transferUser="fetchUsers"
    @passingParent="fetchAssets"
    @selected-user-id="filterTransactions"
   
  ></the-navbar>
  <CardList
    :filteredTransactions="filteredTransactions"
    :users="users"
    :assets="assets"
    :selectedId="selectedId"
   
    @passingformdata="receiveData"
    @passingeditformdata="receiveEditFormData"
    
    
  ></CardList>
  <!-- <div v-else class="other-content">
    <img src="../Assets/alien spaceship-rafiki 3.png" alt="Alien Spaceship Image"/>
</div> -->
</template>

<script>
import TheNavbar from './TheNavbar.vue';
// import Cards from './Cards.vue';
import CardList from './CardList.vue';

export default {
  // props:['transactionDetails'],
  components: {
    TheNavbar,
    CardList
},
 
  data() {
    return {
      transactionDetails: [],
      users: [],
      assets: [],
      filteredTransactions: [],
      selectedId: null,
      componentKey:0,
      Visible: ''

    };
  },
  methods: {
    
    receiveEditFormData(value) {
      const {
        transactionId,
        loaningSupervisorId,
        loaningSupervisorname,
        studentId,
        studentname,
        assetId,
        issueDate,
        assetName,
      } = value;
      const updatedData = {
        loaningSupervisorId: loaningSupervisorId,
        loaningSupervisorname: loaningSupervisorname,
        studentId: studentId,
        studentname: studentname,
        assetId: assetId,
        assetName: assetName,
        loanDate:issueDate,

      };
      console.log("updated data",updatedData)
      this.editTransactions(transactionId, updatedData);
    },
    editTransactions(transactionId, updatedData) {
      fetch(`http://localhost:3000/transactions/${transactionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => {
          if (response.ok) {
            console.log(`Transaction ${transactionId} edited successfully`);
            // Optionally, you can reload the transactions after updating
            this.loadTransactions();
           
          } else {
            console.error(`Failed to update transaction ${transactionId}`);
          }
        })
        .catch((error) => {
          console.error('Error updating transaction:', error);
        });
      this.filterTransactions(this.selectedId);
    },
    receiveData(value) {
      console.log('received data', value);
      const { id, receivingSupervisor, returnDate } = value;
      console.log(id, receivingSupervisor, returnDate);
      // Find the receiving supervisor's ID using their name
      const receivingSupervisorObj = this.users.find((user) => {
        return user.firstName + user.lastName === receivingSupervisor;
      });

      // Extract the receiving supervisor ID
      const receivingSupervisorId = receivingSupervisorObj
        ? receivingSupervisorObj.id
        : null;

      // Prepare the updated data for the PATCH request
      const updatedData = {
        receivingSupervisorId: receivingSupervisorId,
        receivingSupervisorname: receivingSupervisor,
        returnDate: returnDate,
        transactionType: 'Return',
        // Add other fields as required for the update
      };

      // Call the updateTransaction method with the updated data
      this.updateTransaction(id, updatedData);
    },
    
    updateTransaction(transactionId, newData) {
      fetch(`http://localhost:3000/transactions/${transactionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })
        .then((response) => {
          if (response.ok) {
            console.log(`Transaction ${transactionId} updated successfully`);
            // Optionally, you can reload the transactions after updating
            this.loadTransactions();
          } else {
            console.error(`Failed to update transaction ${transactionId}`);
          }
        })
        .catch((error) => {
          console.error('Error updating transaction:', error);
        });
      this.filterTransactions(this.selectedId);
    },

    fetchUsers(value) {
      // console.log("USERS",value);
      this.users = value;
    },
    fetchAssets(value) {
      // console.log("assets",value);
      this.assets = value;
    },
    filterTransactions(userId) {
      // Filter transactions based on the selected user ID
      this.selectedId = userId;
      console.log("SELECTED ID",this.selectedId);
      const selectedUser = this.users.find((user) => user.id === userId);
      if (selectedUser.role === 'Student') {
        this.filteredTransactions = this.transactionDetails.filter(
          (transaction) => {
            // console.log(transaction.userId , userId);
            return (
              transaction.userId === userId ||
              transaction.loaningSupervisorId === userId ||
              transaction.receivingSupervisorId === userId
            );
          }
        );
      } else if (selectedUser.role === 'Supervisor') {
        this.filteredTransactions = this.transactionDetails;
      }
      // console.log(this.filteredTransactions);
    },
    convertDate(value) {
      const isoDate = value;
      const date = new Date(isoDate);

      const day = date.getUTCDate().toString().padStart(2, '0');
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = date.getUTCFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      return formattedDate;
    },
    loadTransactions() {
      fetch('http://localhost:3000/transactions')
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          const results = [];

          for (const id in data) {
            results.push({
              id: data[id].id,
              transactionId: data[id].id,
              device: data[id].assetName,
              user: data[id].studentname,
              userId: data[id].studentId,
              action: data[id].transactionType,
              date: this.convertDate(data[id].loanDate),
              loanSupervisor: data[id].loaningSupervisorname,
              loaningSupervisorId: data[id].loaningSupervisorId,
              returnSupervisor: data[id].receivingSupervisorname,
              returnSupervisorId: data[id].receivingSupervisorId,
              returnDate: data[id].returnDate ? this.convertDate(data[id].returnDate) : '',
              
              assetId: data[id].assetId,
              expanded:false,
            });
          }
          this.transactionDetails = results
          console.log(this.transactionDetails);
          if(this.selectedId)
          {
            this.filterTransactions(this.selectedId);
          }
          
        });
    },
   
    saveData(value) {
      
      console.log('data from child hello', value);
      fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: value.id,
          transactionType: value.transactionType,
          loaningSupervisorId: value.loaningSupervisorId,
          loaningSupervisorname: value.loaningSupervisorname,
          studentId: value.studentId,
          studentname: value.studentname,
          assetId: value.assetId,
          assetName: value.assetName,
          loanDate: value.loanDate,
          receivingSupervisorId: value.receivingSupervisorId,
          receivingSupervisorname: value.receivingSupervisorname,
          returnDate: value.returnDate,
          
        }),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Transaction data saved successfully');
            // Fetch data again after successfully posting
            this.loadTransactions(); // Call the function to fetch updated data
          
          } else {
            console.error('Failed to save transaction data');
          }
        })
        .catch((error) => {
          console.error('Error saving transaction data:', error);
        });
    },
  },
  mounted() {
    // this.filterTransactions=this.transactionDetails;
    this.loadTransactions();
  },
};
</script>
<style scoped>
.other-content {
  max-width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 15px;
  margin-left: -8px;
}
img {
  height: 520px;
}
</style>
