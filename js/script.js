document.addEventListener("DOMContentLoaded", function () {
      // DOM Elements
      const previousOperandElement = document.getElementById("previous-operand");
      const currentOperandElement = document.getElementById("current-operand");
      const numberButtons = document.querySelectorAll(".buttons button:not(.operator):not(.equals):not(.clear):not(.delete):not(.scientific):not(.span-2)");
      const operatorButtons = document.querySelectorAll(".operator");
      const equalsButton = document.querySelector(".equals");
      const clearButton = document.querySelector(".clear");
      const deleteButton = document.querySelector(".delete");
      const decimalButton = document.querySelector("button:nth-last-child(3)");
      const scientificButtons = document.querySelectorAll(".scientific");
      const themeToggle = document.querySelector(".theme-toggle");
      const copyBtn = document.querySelector(".copy-btn");
      const historyToggle = document.querySelector(".history-toggle");
      const historyPanel = document.querySelector(".history-panel");
      const historyList = document.getElementById("history-list");
      const notification = document.getElementById("notification");
      const clickSound = document.getElementById("clickSound");
      const body = document.body;
      
      // Calculator state
      let currentOperand = "0";
      let previousOperand = "";
      let operation = undefined;
      let shouldResetScreen = false;
      let calculationHistory = [];
      
      // Initialize
      updateDisplay();
      
      // Play click sound
      function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play();
      }
      
      // Show notification
      function showNotification(message) {
        notification.textContent = message;
        notification.classList.add("show");
        setTimeout(() => {
          notification.classList.remove("show");
        }, 2000);
      }
      
      // Update display
      function updateDisplay() {
        currentOperandElement.textContent = currentOperand;
        previousOperandElement.textContent =
          previousOperand + (operation ? " " + operation : "");
      }
      
      // Append number
      function appendNumber(number) {
        if (currentOperand === "0" || shouldResetScreen) {
          currentOperand = number;
          shouldResetScreen = false;
        } else {
          currentOperand += number;
        }
      }
      
      // Add decimal
      function addDecimal() {
        if (shouldResetScreen) {
          currentOperand = "0.";
          shouldResetScreen = false;
          return;
        }
        if (currentOperand.includes(".")) return;
        currentOperand += ".";
      }
      
      // Choose operator
      function chooseOperator(op) {
        if (currentOperand === "") return;
        if (previousOperand !== "") {
          calculate();
        }
        operation = op;
        previousOperand = currentOperand;
        shouldResetScreen = true;
      }
      
      // Calculate
      function calculate() {
        let result;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
          case "+":
            result = prev + current;
            break;
          case "-":
            result = prev - current;
            break;
          case "×":
            result = prev * current;
            break;
          case "÷":
            result = current === 0 ? "Error" : prev / current;
            break;
          default:
            return;
        }
        
        // Add to history
        const historyItem = `${previousOperand} ${operation} ${currentOperand} = ${result}`;
        calculationHistory.push(historyItem);
        updateHistory();
        
        currentOperand = result.toString();
        operation = undefined;
        previousOperand = "";
      }
      
      // Clear calculator
      function clear() {
        currentOperand = "0";
        previousOperand = "";
        operation = undefined;
      }
      
      // Delete number
      function deleteNumber() {
        if (
          currentOperand.length === 1 ||
          (currentOperand.length === 2 && currentOperand.startsWith("-"))
        ) {
          currentOperand = "0";
        } else {
          currentOperand = currentOperand.slice(0, -1);
        }
      }
      
      // Handle scientific operations
      function handleScientificOperation(op) {
        const num = parseFloat(currentOperand);
        if (isNaN(num)) return;
        
        let result;
        switch (op) {
          case "x²":
            result = num * num;
            break;
          case "√":
            result = Math.sqrt(num);
            break;
          case "%":
            result = num / 100;
            break;
          case "1/x":
            result = num === 0 ? "Error" : 1 / num;
            break;
          case "±":
            result = -num;
            break;
          default:
            return;
        }
        
        // Add to history
        const historyItem = `${op}(${currentOperand}) = ${result}`;
        calculationHistory.push(historyItem);
        updateHistory();
        
        currentOperand = result.toString();
      }
      
      // Update history panel
      function updateHistory() {
        historyList.innerHTML = "";
        calculationHistory.slice().reverse().forEach(item => {
          const historyItem = document.createElement("div");
          historyItem.className = "history-item";
          historyItem.textContent = item;
          historyItem.addEventListener("click", () => {
            // Extract result from history item
            const result = item.split("= ")[1];
            currentOperand = result;
            updateDisplay();
            playClickSound();
          });
          historyList.appendChild(historyItem);
        });
      }
      
      // Copy result to clipboard
      function copyResult() {
        navigator.clipboard.writeText(currentOperand)
          .then(() => {
            showNotification("Copied to clipboard!");
          })
          .catch(err => {
            showNotification("Failed to copy");
            console.error("Failed to copy: ", err);
          });
      }
      
      // Toggle theme
      function toggleTheme() {
        body.classList.toggle("dark-mode");
        const isDark = body.classList.contains("dark-mode");
        themeToggle.innerHTML = isDark ? '<span class="theme-icon">🌙</span> Dark' : '<span class="theme-icon">☀</span> Light';
      }
      
      // Toggle history panel
      function toggleHistory() {
        historyPanel.classList.toggle("show");
      }
      
      // Event listeners
      numberButtons.forEach((button) => {
        button.addEventListener("click", () => {
          appendNumber(button.textContent);
          updateDisplay();
          playClickSound();
        });
      });
      
      operatorButtons.forEach((button) => {
        button.addEventListener("click", () => {
          chooseOperator(button.textContent);
          updateDisplay();
          playClickSound();
        });
      });
      
      equalsButton.addEventListener("click", () => {
        calculate();
        updateDisplay();
        shouldResetScreen = true;
        playClickSound();
      });
      
      clearButton.addEventListener("click", () => {
        clear();
        updateDisplay();
        playClickSound();
      });
      
      deleteButton.addEventListener("click", () => {
        deleteNumber();
        updateDisplay();
        playClickSound();
      });
      
      decimalButton.addEventListener("click", () => {
        addDecimal();
        updateDisplay();
        playClickSound();
      });
      
      scientificButtons.forEach(button => {
        button.addEventListener("click", () => {
          handleScientificOperation(button.textContent);
          updateDisplay();
          playClickSound();
        });
      });
      
      themeToggle.addEventListener("click", () => {
        toggleTheme();
        playClickSound();
      });
      
      copyBtn.addEventListener("click", () => {
        copyResult();
        playClickSound();
      });
      
      historyToggle.addEventListener("click", () => {
        toggleHistory();
        playClickSound();
      });
      
      // Keyboard support
      document.addEventListener("keydown", (e) => {
        if (e.key >= "0" && e.key <= "9") {
          appendNumber(e.key);
          updateDisplay();
          playClickSound();
        } else if (e.key === ".") {
          addDecimal();
          updateDisplay();
          playClickSound();
        } else if (["+", "-", "*", "/"].includes(e.key)) {
          chooseOperator(e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key);
          updateDisplay();
          playClickSound();
        } else if (e.key === "Enter" || e.key === "=") {
          calculate();
          updateDisplay();
          shouldResetScreen = true;
          playClickSound();
        } else if (e.key === "Backspace") {
          deleteNumber();
          updateDisplay();
          playClickSound();
        } else if (e.key === "Escape") {
          clear();
          updateDisplay();
          playClickSound();
        }
      });
    });