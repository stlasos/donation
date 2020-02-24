<template>
  <div class="container">
    <div class="donate-window">
      <div class="suggestions-wrapper">
        <div v-for="preset in formattedPresets" v-bind:key="preset">
          <div class="form-group">
            <button
              v-bind:class="{'active':amount === preset}"
              v-on:click="amount = preset"
              class="btn btn-primary shadow-sm"
            >{{ preset | money(currency.symbol) }}</button>
          </div>
        </div>
      </div>
      <div class="amount-input">
        <div class="form-group">
          <div class="input-group">
            <div class="currency">
              <div class="form-control">{{ currency.symbol }}</div>
            </div>
            <input
              type="number"
              v-model="amount"
              onkeypress="return event.charCode >= 48 && event.charCode <= 57"
              v-on:keyup="validateAmount($event)"
              title="Numbers only"
              class="form-control"
            />
            <div class="input-group-addon select-input">
              <select name="currencies" v-model="currencyCode" class="form-control">
                <option
                  v-for="c in currencies"
                  v-bind:key="c.code"
                  v-bind:value="c.code"
                >{{ c.code }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="send-area form-group">
        <button v-on:click="sendDonation()" class="btn btn-primary btn-lg shadow-sm donate">Donate</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      amount: 0,
      currencyCode: "USD",
      currency: {
        name: "",
        code: "",
        symbol: "$",
        rate: 0
      },
      presets: [],
      formattedPresets: [],
      suggestion: 0,
      currencies: []
    };
  },
  mounted: function() {
    this.getInitialData();
  },

  watch: {
    currencyCode: function() {
      this.updateCurrency();
    }
  },

  filters: {
    money: function(num, currencySymbol) {
      return currencySymbol + num.toLocaleString("en-US");
    }
  },

  methods: {
    getInitialData: function() {
      axios.get("/get-data").then(response => {
        const data = response.data;
        this.presets = data.presets;
        this.suggestion = data.suggestion;
        this.currencies = data.currencies;
        this.updateCurrency();
        this.updatePresets();
      });
    },

    sendDonation: function() {
      axios
        .post("/donate", { amount: this.amount, currency: this.currency.code })
        .then(
          response => {
            if (response.data.ok) {
              this.showSuccessDonationMessage();
            } else {
              this.showErrorDonationMessage();
            }
          },
          () => {
            this.showErrorDonationMessage();
          }
        );
    },

    showSuccessDonationMessage: function() {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Thank you for your donation!"
      });
    },

    showErrorDonationMessage: function() {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Unknown error."
      });
    },

    getCurrencyByCode: function(code) {
      return this.currencies.find(el => {
        if (el.code === code) {
          return el;
        }
      });
    },

    updateCurrency: function() {
      let oldRate = this.currency.rate;
      this.currency = this.getCurrencyByCode(this.currencyCode);
      if (oldRate !== 0) {
        this.updateAmountWithCurrency(oldRate);
        this.updatePresets();
      }
    },

    updateAmountWithCurrency: function(oldRate) {
      this.amount = this.beautifyAmount(
        this.convertAmount(oldRate, this.currency.rate, this.amount)
      );
    },

    updatePresets: function() {
      for (let i in this.presets) {
        this.formattedPresets[i] = this.beautifyAmount(
          this.convertAmount(1, this.currency.rate, this.presets[i])
        );
      }
    },

    convertAmount: function(oldRate, newRate, amount) {
      return (+amount / oldRate) * newRate;
    },

    beautifyAmount: function(amount) {
      switch (true) {
        case +amount < 300:
          return (+amount / 10).toFixed() * 10;
        case +amount < 1000:
          return (+amount / 50).toFixed() * 50;
        case +amount < 5000:
          return (+amount / 500).toFixed() * 500;
        case +amount < 20000:
          return (+amount / 5000).toFixed() * 5000;
        case +amount < 100000:
          return (+amount / 10000).toFixed() * 10000;
        default:
          return (+amount / 100000).toFixed() * 100000;
      }
    },

    validateAmount: function(event) {
      this.amount = (+this.amount).toFixed();
    }
  }
};
</script>

<style>
</style>
