# 🐛 Debug Recorder - Time-Travel Vibe Debugging with AI





https://github.com/user-attachments/assets/bc70aefe-1d84-4622-a9af-470201d358a5





**Debug Recorder** is a developer tool that captures the execution of your Python programs step-by-step and allows you to analyze it using a visual interface enhanced with AI debugging insights.

## ✨ Features

- ✅ Line-by-line execution recording
- ✅ Variable state tracking at every step
- ✅ Interactive code viewer using Monaco editor
- ✅ AI assistant that explains variable changes and helps debug logic
- ✅ Time-travel view of your code execution
- ✅ Built-in chat to ask debugging questions

---

## 🚀 Getting Started

### 1. Install the Python SDK

```bash
pip install debugrecorder
```

### 2. Annotate your Python code

```python
from debugrecorder import record_debug

@record_debug("mysession.jsonl")
def main():
    x = 5
    y = 10
    print(x + y)
```

Running the code generates a `.jsonl` log file

### 3. Start the NX workspace

```bash
nx serve debugrecorder-ui
```
Upload the log file and the python file to vizualize the program execution

### 📄 Supported Languages

| Language | Status       |
|----------|--------------|
| Python   | ✅ Supported |
| JavaScript | ❌ Not Supported |
| TypeScript | ❌ Not Supported |
| Java     | ❌ Not Supported |
| C++      | ❌ Not Supported |
✅ More languages coming soon!

### 🤖 AI-Powered Debugging
The AI assistant can answer questions like:

- What caused the bug?

- How did the value of x change over time?

- What’s the time taken by a loop or function?

- What’s the summary of this execution?

### 📂 Project Structure


```bash
packages/
├── debugrecorder-ui       # React + Monaco editor frontend
├── sdk/
│   └── python-sdk         # Python SDK to record debug sessions
```

