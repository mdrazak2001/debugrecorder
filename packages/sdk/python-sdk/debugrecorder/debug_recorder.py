import sys
import time
import json
from functools import wraps

class DebugSessionRecorder:
    """
    Record a "debug session" by tracing line events and dumping
    timestamped snapshots of locals to a JSONL logfile.
    """
    def __init__(self, logfile="session.jsonl"):
        self.logfile = logfile
        self.recording = False

    def _trace(self, frame, event, arg):
        # Only record line events
        if event == 'line':
            info = {
                "ts": time.time(),
                "filename": frame.f_code.co_filename,
                "line_no": frame.f_lineno,
                "locals": {k: repr(v) for k, v in frame.f_locals.items()},
            }
            with open(self.logfile, "a") as f:
                f.write(json.dumps(info) + "\n")
        return self._trace

    def start(self):
        """Begin tracing"""
        if not self.recording:
            sys.settrace(self._trace)
            self.recording = True

    def stop(self):
        """Stop tracing"""
        if self.recording:
            sys.settrace(None)
            self.recording = False

# Singleton recorder
recorder = DebugSessionRecorder()


def record_debug(logfile="session.jsonl"):
    """
    Decorator to wrap any function in a debug-recording session.
    Usage:
        @record_debug("mydebug.jsonl")
        def my_func(...):
            ...
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Point recorder at the desired logfile
            recorder.logfile = logfile
            recorder.start()
            try:
                return fn(*args, **kwargs)
            finally:
                recorder.stop()
        return wrapper
    return decorator

