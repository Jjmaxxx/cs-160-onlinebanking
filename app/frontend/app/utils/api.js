
export async function deposit(account_id, amount) {
    let data = await make_request(`http://localhost:12094/accounts/deposit?account_id=${account_id}&amount=${amount}`, "GET");

    return data.message;
  }

 export async function withdraw(account_id, amount) {
    let data = await make_request(`http://localhost:12094/accounts/withdraw?account_id=${account_id}&amount=${amount}`, "GET");

    return data.message;
  }

  export async function transferToEmail(from_account_id, to_email, amount) {
    let data = await make_request(`http://localhost:12094/accounts/transfer?account_id=${from_account_id}&destination_email=${to_email}&amount=${amount}`, "GET");

    return data.message;
  }

  export async function transferToSelf(from_account_id, to_account_id, amount) {
    let data = await make_request(`http://localhost:12094/accounts/transfer?account_id=${from_account_id}&destination_account_id=${to_account_id}&amount=${amount}`, "GET");

    return data.message;
  }

  async function make_request(url, method = "GET", body = null) {
    try {
      let options = {
        method: method,
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      };
  
      if (body) {
        options.body = JSON.stringify(body);
      }
  
      let response = await fetch(url, options);
      let data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }
  
      return data;
    } catch (error) {
      return {
        message: error.message || "An error occurred",
      }; // Return an object with the error message
    }
  }
