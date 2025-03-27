"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class CatalogApp {
    constructor() {
        this.categoriesContainer = document.getElementById('categories-list');
        this.contentContainer = document.getElementById('category-content');
        this.initEventListeners();
        this.loadCategories();
    }
    initEventListeners() {
        document.getElementById('home-link').addEventListener('click', () => this.loadCategories());
        document.getElementById('catalog-link').addEventListener('click', () => this.loadCategories());
    }
    loadCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('data/categories.json');
                const data = yield response.json();
                this.renderCategories(data.categories);
            }
            catch (error) {
                console.error('Error loading categories:', error);
            }
        });
    }
    renderCategories(categories) {
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
    loadRandomCategory(categories) {
        const randomIndex = Math.floor(Math.random() * categories.length);
        const randomCategory = categories[randomIndex];
        this.loadCategoryContent(randomCategory.shortname);
    }
    loadCategoryContent(categoryShortname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`data/${categoryShortname}.json`);
                const data = yield response.json();
                this.renderCategoryContent(data);
            }
            catch (error) {
                console.error('Error loading category content:', error);
            }
        });
    }
    renderCategoryContent(categoryData) {
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
