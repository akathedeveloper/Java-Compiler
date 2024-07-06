# Java Code Compiler and Runner API

This Node.js project sets up an Express server to compile and run Java code provided by the client. The server receives Base64-encoded Java code, compiles it, runs it, and returns the output or any errors in Base64 format.
Features

- Accepts Java code in Base64-encoded format.
- Compiles the provided Java code.
- Executes the compiled Java code.
- Returns the output or errors in Base64-encoded format.
- Accepts optional inputs for the Java program.

## API Endpoint
### POST /compile-run
#### Request
Body: JSON object
- code: (string) Base64-encoded Java code.
- filename: (string) Name of the Java file without the .java extension.
- input: (array of strings, optional) Base64-encoded input strings for the Java program.

#### Response

Success: HTTP 200
status-code: 200
- message: "success"
- output: Base64-encoded stdout output.
- code: Original Base64-encoded code.
- filename: Provided filename.
- input: Base64-encoded input strings.

Compilation Failure: HTTP 400
- status-code: 400
- message: "Compilation failed"
- output: Base64-encoded stderr output.
- code: Original Base64-encoded code.
- filename: Provided filename.

Execution Failure: HTTP 400
- status-code: 400
- message: "Execution failed"
- output: Base64-encoded stderr output.
- code: Original Base64-encoded code.
- filename: Provided filename.
- input: Base64-encoded input strings

Compilation/Execution Error: HTTP 500
- status-code: 500
- message: "Compilation/Execution error"
- output: Base64-encoded error message.
- code: Original Base64-encoded code.
- filename: Provided filename.
- input: Base64-encoded input strings (if any)
