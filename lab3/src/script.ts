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
        this.categoriesContainer = document.getElementById('categories-list')!;
        this.contentContainer = document.getElementById('category-content')!;

        this.initEventListeners();
        this.loadCategories();
    }

    private initEventListeners(): void {
        document.getElementById('home-link')!.addEventListener('click', () => this.loadCategories());
        document.getElementById('catalog-link')!.addEventListener('click', () => this.loadCategories());
    }

    private async loadCategories(): Promise<void> {
        try {
            const response = await fetch('data/categories.json');
            const data = await response.json();
            this.renderCategories(data.categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    private renderCategories(categories: Category[]): void {
        this.categoriesContainer.innerHTML = '';
        this.contentContainer.innerHTML = '';

        categories.forEach(category => {
            const categoryLink = document.createElement('a');
            categoryLink.href = '#';
            categoryLink.textContent = category.name;
            categoryLink.addEventListener('click', () => this.loadCategoryContent(category.shortname));
            this.categoriesContainer.appendChild(categoryLink);
        });

        // Add Specials link
        const specialsLink = document.createElement('a');
        specialsLink.href = '#';
        specialsLink.textContent = 'Specials';
        specialsLink.addEventListener('click', () => this.loadRandomCategory(categories));
        this.categoriesContainer.appendChild(specialsLink);
    }

    private loadRandomCategory(categories: Category[]): void {
        const randomIndex = Math.floor(Math.random() * categories.length);
        const randomCategory = categories[randomIndex];
        this.loadCategoryContent(randomCategory.shortname);
    }

    private async loadCategoryContent(categoryShortname: string): Promise<void> {
        try {
            const response = await fetch(`data/${categoryShortname}.json`);
            const data = await response.json();
            this.renderCategoryContent(data);
        } catch (error) {
            console.error('Error loading category content:', error);
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
                <p>Ціна: ${product.price}</p>
            `;
            productGrid.appendChild(productElement);
        });

        this.contentContainer.appendChild(productGrid);
    }
}

document.addEventListener('DOMContentLoaded', () => new CatalogApp());