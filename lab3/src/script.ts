interface Category {
    id: number;
    name: string;
    shortname: string;
    notes: string;
}

interface Product {
    id: number;
    name: string;
    shortname: string;
    description: string;
    price: number;
    image: string;
}

class CatalogApp {
    private categoriesContainer: HTMLElement;
    private contentContainer: HTMLElement;

    constructor() {
        const categoriesContainer = document.getElementById('categories-list');
        const contentContainer = document.getElementById('category-content');

        if (!categoriesContainer || !contentContainer) {
            throw new Error('Не знайдено необхідні контейнери DOM');
        }

        this.categoriesContainer = categoriesContainer;
        this.contentContainer = contentContainer;

        this.initEventListeners();
        this.loadCategories();
    }

    private initEventListeners(): void {
        const homeLink = document.getElementById('home-link');
        const catalogLink = document.getElementById('catalog-link');

        if (homeLink) {
            homeLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadCategories();
            });
        }

        if (catalogLink) {
            catalogLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadCategories();
            });
        }
    }

    private async loadCategories(): Promise<void> {
        try {
            console.log('Завантаження категорій');
            const response = await fetch('data/categories.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Отримані категорії:', data);
            this.renderCategories(data.categories);
        } catch (error) {
            console.error('Помилка завантаження категорій:', error);
        }
    }

    private renderCategories(categories: Category[]): void {
        this.categoriesContainer.innerHTML = '';
        this.contentContainer.innerHTML = '';

        categories.forEach(category => {
            const categoryLink = document.createElement('a');
            categoryLink.href = '#';
            categoryLink.textContent = category.name;
            categoryLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadCategoryContent(category.shortname);
            });
            this.categoriesContainer.appendChild(categoryLink);
        });

        const specialsLink = document.createElement('a');
        specialsLink.href = '#';
        specialsLink.textContent = 'Спеціальні пропозиції';
        specialsLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadRandomCategory(categories);
        });
        this.categoriesContainer.appendChild(specialsLink);
    }

    private loadRandomCategory(categories: Category[]): void {
        const randomIndex = Math.floor(Math.random() * categories.length);
        const randomCategory = categories[randomIndex];
        this.loadCategoryContent(randomCategory.shortname);
    }

    private async loadCategoryContent(categoryShortname: string): Promise<void> {
        try {
            console.log(`Завантаження вмісту категорії: ${categoryShortname}`);
            const response = await fetch(`data/${categoryShortname}.json`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Отримані дані категорії:', data);
            this.renderCategoryContent(data);
        } catch (error) {
            console.error('Помилка завантаження вмісту категорії:', error);
        }
    }

    private renderCategoryContent(categoryData: { name: string, items: Product[] }): void {
        this.contentContainer.innerHTML = `<h2>${categoryData.name}</h2>`;
        
        const productGrid = document.createElement('div');
        productGrid.classList.add('product-grid');

        categoryData.items.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-item');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Ціна: ${product.price} грн</p>
            `;
            productGrid.appendChild(productElement);
        });

        this.contentContainer.appendChild(productGrid);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM повністю завантажений');
    new CatalogApp();
});