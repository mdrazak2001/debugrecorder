from setuptools import setup, find_packages
from pathlib import Path

this_directory = Path(__file__).parent
# long_description = (this_directory / "README.md").read_text()

setup(
    name="debugrecorder",
    version="0.1.0",
    packages=find_packages(),
    description="A Python debug session recorder that captures line events and variable states",
    author="Mohammed Razak",
    author_email="mohammedrazak2001@gmail.com",
    url="https://github.com/mdrazak2001/debugrecorder",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
    ],
    python_requires=">=3.6",
) 