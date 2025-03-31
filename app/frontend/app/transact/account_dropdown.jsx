export function AccountDropdown({
  accounts,
  selectedAccount,
  onChange,
}) {
    const onChangeAction = (e) => {
        onChange(accounts.find((acc) => acc.id == e.target.value))
    };
  return (
    <select
      className="mb-4 w-full px-4 py-2 border rounded"
      value={selectedAccount?.id || ""}
      onChange={onChangeAction} // Call the onChange function passed from parent component
    >
    <option value="" disabled>
        Select an account
    </option>
      {accounts.map((account) => (
        <option key={account.id} value={account.id}>
          {account.account_type} - ${account.balance}
        </option>
      ))}
    </select>
  );
}
