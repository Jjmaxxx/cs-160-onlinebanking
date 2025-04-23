

export async function deposit(account_id, amount) {
    let data = await make_request(`${process.env.NEXT_PUBLIC_API_URL}/accounts/deposit?account_id=${account_id}&amount=${amount}`, "GET");

    return data.message;
  }
  export async function deposit_check(account_id, formData) {
    let data = await make_form_request(`${process.env.NEXT_PUBLIC_API_URL}/accounts/deposit_check?account_id=${account_id}`, "POST", formData);
  
    return data.message;
  }
 export async function withdraw(account_id, amount) {
    let data = await make_request(`${process.env.NEXT_PUBLIC_API_URL}/accounts/withdraw?account_id=${account_id}&amount=${amount}`, "GET");

    return data.message;
  }

  export async function transferToAccount(from_account_id, to_account_num, amount) {
    let data = await make_request(`${process.env.NEXT_PUBLIC_API_URL}/accounts/transfer?account_id=${from_account_id}&destination_account_number=${to_account_num}&amount=${amount}`, "GET");

    return data.message;
  }

  export async function transferToSelf(from_account_id, to_account_id, amount) {
    let data = await make_request(`${process.env.NEXT_PUBLIC_API_URL}/accounts/transfer?account_id=${from_account_id}&destination_account_number=${to_account_id}&amount=${amount}`, "GET");

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

async function make_form_request(url, method = "POST", formData = null) {
  try {
    let options = {
      method: method,
      credentials: "include",
      body: formData
    };

    let response = await fetch(url, options);
    let data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "An error occurred");
    }

    return data;
  } catch (error) {
    return {
      message: error.message || "An error occurred",
    };
  }
}