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

        this.addLinkListener(homeLink);
        this.addLinkListener(catalogLink);
    }

    private addLinkListener(link: HTMLElement | null): void {
        if (link) {
            link.addEventListener('click', this.handleLinkClick.bind(this));
        }
    }

    private handleLinkClick(e: Event): void {
        e.preventDefault();
        this.loadCategories();
    }

    private async loadCategories(): Promise<void> {
        try {
            console.log('Завантаження категорій');
            const response = await fetch('../src/data/categories.json');
            
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
            const categoryLink = this.createCategoryLink(category);
            this.categoriesContainer.appendChild(categoryLink);
        });

        const specialsLink = this.createSpecialsLink(categories);
        this.categoriesContainer.appendChild(specialsLink);
    }

    private createCategoryLink(category: Category): HTMLAnchorElement {
        const categoryLink = document.createElement('a');
        categoryLink.href = '#';
        categoryLink.textContent = category.name;
        categoryLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadCategoryContent(category.shortname);
        });
        return categoryLink;
    }

    private createSpecialsLink(categories: Category[]): HTMLAnchorElement {
        const specialsLink = document.createElement('a');
        specialsLink.href = '#';
        specialsLink.textContent = 'Спеціальні пропозиції';
        specialsLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadRandomCategory(categories);
        });
        return specialsLink;
    }

    private loadRandomCategory(categories: Category[]): void {
        const randomIndex = Math.floor(Math.random() * categories.length);
        const randomCategory = categories[randomIndex];
        this.loadCategoryContent(randomCategory.shortname);
    }

    private async loadCategoryContent(categoryShortname: string): Promise<void> {
        try {
            console.log(`Завантаження вмісту категорії: ${categoryShortname}`);
            const response = await fetch(`../src/data/${categoryShortname}.json`);
            
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
        // Create elements instead of using innerHTML to avoid potential CSP issues
        const titleElement = document.createElement('h2');
        titleElement.textContent = categoryData.name;
        this.contentContainer.innerHTML = ''; // Clear previous content
        this.contentContainer.appendChild(titleElement);
        
        const productGrid = document.createElement('div');
        productGrid.classList.add('product-grid');

        categoryData.items.forEach(product => {
            const productElement = this.createProductElement(product);
            productGrid.appendChild(productElement);
        });

        this.contentContainer.appendChild(productGrid);
    }

    private createProductElement(product: Product): HTMLDivElement {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');

        const imgElement = document.createElement('img');
        imgElement.src = product.image;
        imgElement.alt = product.name;

        const nameElement = document.createElement('h3');
        nameElement.textContent = product.name;

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = product.description;

        const priceElement = document.createElement('p');
        priceElement.textContent = `Ціна: ${product.price} грн`;

        productElement.appendChild(imgElement);
        productElement.appendChild(nameElement);
        productElement.appendChild(descriptionElement);
        productElement.appendChild(priceElement);

        return productElement;
    }
}

// Use an IIFE to avoid global scope pollution
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM повністю завантажений');
        new CatalogApp();
    });
})();