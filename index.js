const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const base64 = require('base-64');

const app = express();
app.use(bodyParser.json());

app.post('/compile-run', (req, res) => {
    const tempDir = 'tmp';
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const code = base64.decode(req.body.code);
    const filename = req.body.filename + '.java';
    const filePath = path.join(tempDir, filename);

    fs.writeFileSync(filePath, code);

    const compileProc = spawn('javac', [filePath]);
    let compileStderr = '';

    compileProc.stderr.on('data', (data) => {
        compileStderr += data.toString();
    });

    compileProc.on('close', (compileCode) => {
        if (compileCode !== 0) {
            return res.status(400).json({
                'status-code': 400,
                'message': 'Compilation failed',
                'output': base64.encode(compileStderr),
                'code': req.body.code,
                'filename': req.body.filename
            });
        }

        const concatenatedInputs = (req.body.input || []).map(inputValue => base64.decode(inputValue)).join('\n');
        const classFilename = filename.replace('.java', '');
        const runProc = spawn('java', ['-cp', tempDir, classFilename]);

        let runStdout = '';
        let runStderr = '';

        runProc.stdin.write(concatenatedInputs);
        runProc.stdin.end();

        runProc.stdout.on('data', (data) => {
            runStdout += data.toString();
        });

        runProc.stderr.on('data', (data) => {
            runStderr += data.toString();
        });

        runProc.on('close', (runCode) => {
            if (runCode !== 0) {
                return res.status(400).json({
                    'status-code': 400,
                    'message': 'Execution failed',
                    'output': base64.encode(runStderr),
                    'code': req.body.code,
                    'filename': req.body.filename,
                    'input': base64.encode(concatenatedInputs)
                });
            } else {
                return res.status(200).json({
                    'status-code': 200,
                    'message': 'success',
                    'output': base64.encode(runStdout),
                    'code': req.body.code,
                    'filename': req.body.filename,
                    'input': base64.encode(concatenatedInputs)
                });
            }
        });

        runProc.on('error', (error) => {
            return res.status(500).json({
                'status-code': 500,
                'message': 'Execution error',
                'output': base64.encode(error.message),
                'code': req.body.code,
                'filename': req.body.filename,
                'input': base64.encode(concatenatedInputs)
            });
        });
    });

    compileProc.on('error', (error) => {
        return res.status(500).json({
            'status-code': 500,
            'message': 'Compilation error',
            'output': base64.encode(error.message),
            'code': req.body.code,
            'filename': req.body.filename
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
