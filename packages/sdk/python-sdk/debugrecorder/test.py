from debug_recorder import record_debug

class BankAccount:
    def __init__(self, owner: str, balance: float = 0.0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount: float):
        self.balance += amount

    def withdraw(self, amount: float):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

    def __str__(self):
        return f"{self.owner}'s account balance: ${self.balance:.2f}"

@record_debug("complex_session.jsonl")
def perform_transactions():
    alice = BankAccount("Alice", 100.0)
    bob = BankAccount("Bob", 50.0)

    transactions = [
        ("Alice", "deposit", 30.0),
        ("Bob", "withdraw", 20.0),
        ("Alice", "withdraw", 70.0),
        ("Bob", "withdraw", 100.0),  # Should trigger exception
    ]

    for idx, (person, action, amount) in enumerate(transactions):
        print(f"Step {idx + 1}: {person} performs {action} of ${amount}")
        try:
            account = alice if person == "Alice" else bob
            if action == "deposit":
                account.deposit(amount)
            elif action == "withdraw":
                account.withdraw(amount)
            print(account)
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    perform_transactions()
