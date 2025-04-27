from debug_recorder import record_debug

@record_debug("mysession.jsonl")
def main():
    x = 5
    y = 10
    z = x + y
    print(f"z = {z}")

    for i in range(3):
        squared = i * z
        print(f"i={i}, \ti*z={squared}")

if __name__ == "__main__":
    main()