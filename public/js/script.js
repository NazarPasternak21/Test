document.addEventListener('DOMContentLoaded', () => {
    const manufacturerInput = document.getElementById('manufacturer');
    const laptopList = document.getElementById('laptop-list');
    const laptopModal = document.getElementById('laptop-modal');
    const saveLaptopBtn = document.getElementById('save-laptop-btn');
    const switchButton = document.getElementById('toggle-switch');
    const myLaptopsBtn = document.getElementById('my-laptops-btn');
    const countElement = document.getElementById('count');

    let laptops = [];
    let originalLaptops = []; // Додав вибірковий масив для оригінальних даних

    const modalTitle = document.getElementById('modal-title');
    const cpuInput = document.getElementById('cpu');
    const gpuInput = document.getElementById('gpu');
    const priceInput = document.getElementById('price');
    const laptopIdInput = document.getElementById('laptop-id');
    const createBtn = document.getElementById('create-btn');

    function updateLaptopCount() {
        countElement.textContent = laptops.length;
    }

    function displayLaptops(laptopData = laptops) {
        laptopList.innerHTML = '';
        laptopData.forEach((laptop, index) => {
            const laptopItem = document.createElement('div');
            laptopItem.className = 'laptop-item';
            laptopItem.innerHTML = `
                <h3>${laptop.manufacturer}</h3>
                <p>CPU: ${laptop.cpu}</p>
                <p>GPU: ${laptop.gpu}</p>
                <p>Price: ${laptop.price}</p>
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            laptopList.appendChild(laptopItem);
        });
    }

    function openLaptopModal(title) {
        modalTitle.textContent = title;
        laptopModal.style.display = 'block';
    }

    function closeLaptopModal() {
        laptopModal.style.display = 'none';
        document.getElementById('laptop-form').reset();
        laptopIdInput.value = '';
    }

    function saveLaptop() {
        const manufacturer = manufacturerInput.value.trim();
        const cpu = cpuInput.value.trim();
        const gpu = gpuInput.value.trim();
        const price = parseFloat(priceInput.value);

        if (!manufacturer || !cpu || !gpu || isNaN(price) || price < 1) {
            alert('Please enter all fields correctly.');
            return;
        }

        const laptopId = laptopIdInput.value;
        const laptopData = { manufacturer, cpu, gpu, price };

        if (laptopId === '') {
            laptops.push(laptopData);
        } else {
            laptops[laptopId] = laptopData;
        }

        displayLaptops();
        closeLaptopModal();
        updateLaptopCount();
    }

    // Визначення createBtn було перенесено внутрішньо, оскільки він використовується в багатьох функціях

    document.getElementById('search-btn').addEventListener('click', () => {
        const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
        const filteredLaptops = laptops.filter((laptop) =>
            laptop.manufacturer.toLowerCase().includes(searchInput)
        );
        displayLaptops(filteredLaptops);
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        laptops.length = 0;
        displayLaptops();
        updateLaptopCount();
    });

    createBtn.addEventListener('click', () => {
        openLaptopModal('Create Laptop');
    });

    saveLaptopBtn.addEventListener('click', saveLaptop);

    laptopList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const index = e.target.getAttribute('data-index');
            const laptopData = laptops[index];
            openLaptopModal('Edit Laptop');
            manufacturerInput.value = laptopData.manufacturer;
            cpuInput.value = laptopData.cpu;
            gpuInput.value = laptopData.gpu;
            priceInput.value = laptopData.price;
            laptopIdInput.value = index;
        } else if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-index');
            laptops.splice(index, 1);
            displayLaptops();
            updateLaptopCount();
        }
    });

    document.getElementById('close-modal').addEventListener('click', closeLaptopModal);

    switchButton.addEventListener('click', () => {
        switchButton.classList.toggle('switch-on');

        if (switchButton.classList.contains('switch-on')) {
            laptops.sort((a, b) => a.price - b.price);
            displayLaptops();
        } else {
            laptops = [...originalLaptops];
            displayLaptops();
        }
    });

    myLaptopsBtn.addEventListener('click', () => {
        displayLaptops();
    });

    // Додавання нового лаптопа
    createBtn.addEventListener('click', () => {
        openLaptopModal('Create Laptop');
    });

    // Ініціалізація лаптопів з сервера (просто як приклад)
    fetch('/laptops')
        .then((response) => response.json())
        .then((data) => {
            laptops = data;
            originalLaptops = [...laptops]; // Збереження оригінальних даних
            displayLaptops();
            updateLaptopCount();
        })
        .catch((error) => {
            console.error('Error loading laptops:', error);
            alert('Error loading laptops. Please try again.');
        });
});
