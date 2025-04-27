from setuptools import setup, find_packages

setup(
    name="debugrecorder",
    version="0.1.0",
    author="Mohammed Razak",
    author_email="mohammedrazak2001@gmail.com",
    description="A lightweight SDK to record and replay Python debug sessions",
    packages=find_packages(),  # This auto-detects 'debugrecorder' package
    install_requires=[],       # Add dependencies if you use any
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.7",
)
