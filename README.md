# dirreader

NodeJS module that exports a functions which can retrieve the contents(dirnames/filename) of a given target path and all its subdirectories. 

### Response template:
```javascript
      {
        filenames: [<file-names>],
        dirnames: [<dir-names>]
      }
```
## APIs Avaialble

### 1. readDirSync
  Reads the contents of a directory Synchronously.
  * path _String_
  
  _Example_: 
  ```javascript
      rd.readDirSync(path);
  ```

### 2. readDir
  Reads the contents of a directory Asynchronously.
  * path _String_
  
  _Example_: 
  ```javascript
  rd.readDir(path, callback);
  ```
  
  ### Requirements
    "node": ">=6.11.0"
    
  ### Installation
      1. clone the repository.
      2. run the command `npm install`
  
  ### Running Testcases
      1. `Mocha` and `Chai` are used for testing module.
      2. run the command `npm test` to see the test results.
      
 ### Roadmap
      1. Adding filters with file types.
      2. Adding level constraints for directories.
      3. Ordered response for Async API.
      
      
