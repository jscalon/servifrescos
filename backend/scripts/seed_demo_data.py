# -*- coding: utf-8 -*-
"""
Puebla la base de datos con datos de demostración realistas.

Genera tiendas, categorías, marcas, productos, usuarios con distintos perfiles
de permisos y un conjunto reducido de precios: 2 vigentes, 2 vencidos y 2
programados.

Uso:
    docker compose exec backend python scripts/seed_demo_data.py
    docker compose exec backend python scripts/seed_demo_data.py --reset
"""

import os
import random
import sys
from datetime import timedelta
from decimal import Decimal

sys.path.insert(0, '/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

import django
django.setup()

from django.utils import timezone

from apps.categories.models import Brand, Department, Group, ProductType, Subgroup
from apps.prices.models import Price
from apps.products.models import Product
from apps.stores.models import Store
from apps.users.models import Permission, User

random.seed(20260914)

NOW = timezone.now()
DEMO_PASSWORD = 'Servifrescos2026!'


def log(message):
    print(message, flush=True)


# ---------------------------------------------------------------------------
# Tiendas
# ---------------------------------------------------------------------------

STORES = [
    (1, 'Servifresco Valencia Centro',
     'Av. Bolívar Norte, C.C. Camoruco, Nivel PB, Valencia, Carabobo', Decimal('1.00')),
    (2, 'Servifresco Naguanagua',
     'Av. Universidad, Sector Bárbula, Naguanagua, Carabobo', Decimal('0.98')),
    (3, 'Servifresco Maracay Las Delicias',
     'Av. Las Delicias, C.C. Paseo Las Delicias II, Maracay, Aragua', Decimal('1.02')),
    (4, 'Servifresco Caracas La Candelaria',
     'Av. Urdaneta, Esquina Candilito, Parroquia La Candelaria, Caracas', Decimal('1.09')),
    (5, 'Servifresco Barquisimeto Este',
     'Av. Lara con Av. Los Leones, C.C. Sambil, Barquisimeto, Lara', Decimal('0.99')),
    (6, 'Servifresco Maracaibo Norte',
     'Av. 5 de Julio con Calle 72, Sector Tierra Negra, Maracaibo, Zulia', Decimal('1.04')),
    (7, 'Servifresco San Cristóbal',
     'Av. Ferrero Tamayo, C.C. Sambil, San Cristóbal, Táchira', Decimal('1.06')),
    (8, 'Servifresco Puerto La Cruz',
     'Av. Municipal, Sector Paseo Colón, Puerto La Cruz, Anzoátegui', Decimal('1.05')),
]


# ---------------------------------------------------------------------------
# Categorías
# ---------------------------------------------------------------------------

DEPARTMENTS = [
    ('01', 'Alimentos Frescos'),
    ('02', 'Charcutería y Lácteos'),
    ('03', 'Abarrotes'),
    ('04', 'Bebidas'),
    ('05', 'Limpieza y Hogar'),
    ('06', 'Cuidado Personal'),
]

GROUPS = [
    ('0101', 'Carnes y Aves', '01'),
    ('0102', 'Frutas y Hortalizas', '01'),
    ('0103', 'Panadería', '01'),
    ('0201', 'Charcutería', '02'),
    ('0202', 'Lácteos', '02'),
    ('0203', 'Quesos', '02'),
    ('0301', 'Granos y Cereales', '03'),
    ('0302', 'Aceites y Salsas', '03'),
    ('0303', 'Harinas y Pastas', '03'),
    ('0304', 'Enlatados', '03'),
    ('0401', 'Refrescos y Jugos', '04'),
    ('0402', 'Aguas y Maltas', '04'),
    ('0501', 'Detergentes', '05'),
    ('0502', 'Papelería del Hogar', '05'),
    ('0601', 'Higiene Personal', '06'),
]

SUBGROUPS = [
    ('010101', 'Pollo', '0101'),
    ('010102', 'Carne de Res', '0101'),
    ('010103', 'Carne de Cerdo', '0101'),
    ('010104', 'Pescados y Mariscos', '0101'),
    ('010201', 'Frutas', '0102'),
    ('010202', 'Hortalizas', '0102'),
    ('010203', 'Tubérculos', '0102'),
    ('010301', 'Pan Diario', '0103'),
    ('010302', 'Repostería', '0103'),
    ('020101', 'Jamones', '0201'),
    ('020102', 'Mortadelas', '0201'),
    ('020103', 'Salchichas', '0201'),
    ('020104', 'Chorizos y Embutidos', '0201'),
    ('020201', 'Leche', '0202'),
    ('020202', 'Yogurt', '0202'),
    ('020203', 'Mantequilla y Margarina', '0202'),
    ('020301', 'Queso Blanco', '0203'),
    ('020302', 'Queso Amarillo', '0203'),
    ('030101', 'Arroz', '0301'),
    ('030102', 'Caraotas y Frijoles', '0301'),
    ('030103', 'Lentejas y Granos', '0301'),
    ('030104', 'Azúcar y Sal', '0301'),
    ('030201', 'Aceites', '0302'),
    ('030202', 'Mayonesa y Salsas', '0302'),
    ('030301', 'Harina de Maíz', '0303'),
    ('030302', 'Harina de Trigo', '0303'),
    ('030303', 'Pastas', '0303'),
    ('030401', 'Atún y Sardinas', '0304'),
    ('030402', 'Vegetales Enlatados', '0304'),
    ('040101', 'Refrescos', '0401'),
    ('040102', 'Jugos y Néctares', '0401'),
    ('040201', 'Agua Mineral', '0402'),
    ('040202', 'Maltas', '0402'),
    ('050101', 'Detergente en Polvo', '0501'),
    ('050102', 'Lavaplatos', '0501'),
    ('050103', 'Cloro y Desinfectantes', '0501'),
    ('050201', 'Papel Higiénico', '0502'),
    ('050202', 'Servilletas y Toallas', '0502'),
    ('060101', 'Jabón y Champú', '0601'),
    ('060102', 'Cuidado Bucal', '0601'),
    ('060103', 'Afeitado y Desodorante', '0601'),
]

BRANDS = [
    'Protinal', 'Proagro', 'Polar', 'Mavesa', 'Diana', 'Plumrose',
    'Los Andes', 'La Campiña', 'Purina', 'Nestlé', 'Pampero', 'Primor',
    'Vatel', 'Heinz', 'Colgate', 'Palmolive', 'Las Llaves', 'Ariel',
    'Rosal', 'Coca-Cola', 'Pepsi', 'Yukery', 'Minalba', 'Natulac',
    'Alfonzo Rivas', 'Maizina Americana', 'Selecta', 'Ronco',
    'Frescos del Campo', 'Horno Criollo', 'Margarita',
]

PRODUCT_TYPES = [
    'Unidad', 'Peso Variable', 'Empaquetado', 'Granel',
    'Refrigerado', 'Congelado', 'Bulto',
]


# ---------------------------------------------------------------------------
# Productos: (subgrupo, descripcion, marca, tipo, precio base en Bs)
# ---------------------------------------------------------------------------

PRODUCTS = [
    ('010101', 'Pollo Entero Fresco Kg', 'Protinal', 'Peso Variable', '178.50'),
    ('010101', 'Pechuga de Pollo sin Hueso Kg', 'Protinal', 'Peso Variable', '265.00'),
    ('010101', 'Muslos de Pollo Bandeja Kg', 'Protinal', 'Peso Variable', '152.00'),
    ('010101', 'Alas de Pollo Congeladas Kg', 'Proagro', 'Congelado', '138.00'),
    ('010101', 'Pollo Entero Congelado Kg', 'Proagro', 'Congelado', '165.00'),
    ('010101', 'Milanesa de Pollo Empanizada 500g', 'Protinal', 'Congelado', '289.00'),
    ('010102', 'Carne Molida de Primera Kg', 'Selecta', 'Peso Variable', '310.00'),
    ('010102', 'Bistec de Res Kg', 'Selecta', 'Peso Variable', '345.00'),
    ('010102', 'Costilla de Res Kg', 'Selecta', 'Peso Variable', '220.00'),
    ('010102', 'Lagarto con Hueso Kg', 'Selecta', 'Peso Variable', '198.00'),
    ('010103', 'Chuleta de Cerdo Ahumada Kg', 'Plumrose', 'Refrigerado', '268.00'),
    ('010103', 'Pernil de Cerdo Kg', 'Selecta', 'Peso Variable', '235.00'),
    ('010103', 'Tocineta Ahumada 250g', 'Plumrose', 'Empaquetado', '96.00'),
    ('010104', 'Filete de Merluza Congelado Kg', 'Ronco', 'Congelado', '245.00'),
    ('010104', 'Camarones Pelados 500g', 'Ronco', 'Congelado', '420.00'),
    ('010104', 'Sardina Fresca Kg', 'Ronco', 'Peso Variable', '68.00'),
    ('010201', 'Cambur Manzano Kg', 'Frescos del Campo', 'Granel', '28.00'),
    ('010201', 'Naranja Valencia Kg', 'Frescos del Campo', 'Granel', '22.00'),
    ('010201', 'Manzana Roja Importada Kg', 'Frescos del Campo', 'Granel', '115.00'),
    ('010201', 'Lechosa Kg', 'Frescos del Campo', 'Granel', '35.00'),
    ('010201', 'Piña Unidad', 'Frescos del Campo', 'Unidad', '48.00'),
    ('010201', 'Aguacate Unidad', 'Frescos del Campo', 'Unidad', '62.00'),
    ('010202', 'Tomate Perita Kg', 'Frescos del Campo', 'Granel', '38.00'),
    ('010202', 'Cebolla Blanca Kg', 'Frescos del Campo', 'Granel', '32.00'),
    ('010202', 'Pimentón Rojo Kg', 'Frescos del Campo', 'Granel', '55.00'),
    ('010202', 'Ajo Porro Unidad', 'Frescos del Campo', 'Unidad', '18.00'),
    ('010202', 'Lechuga Americana Unidad', 'Frescos del Campo', 'Unidad', '26.00'),
    ('010202', 'Zanahoria Kg', 'Frescos del Campo', 'Granel', '29.00'),
    ('010203', 'Papa Nacional Kg', 'Frescos del Campo', 'Granel', '34.00'),
    ('010203', 'Yuca Kg', 'Frescos del Campo', 'Granel', '21.00'),
    ('010203', 'Ñame Kg', 'Frescos del Campo', 'Granel', '45.00'),
    ('010203', 'Ocumo Kg', 'Frescos del Campo', 'Granel', '39.00'),
    ('010301', 'Pan Canilla Unidad', 'Horno Criollo', 'Unidad', '12.00'),
    ('010301', 'Pan Campesino Unidad', 'Horno Criollo', 'Unidad', '35.00'),
    ('010301', 'Pan de Sándwich Blanco 500g', 'Horno Criollo', 'Empaquetado', '58.00'),
    ('010301', 'Pan Integral 500g', 'Horno Criollo', 'Empaquetado', '72.00'),
    ('010302', 'Golfeado con Queso Unidad', 'Horno Criollo', 'Unidad', '28.00'),
    ('010302', 'Torta de Chocolate Porcion', 'Horno Criollo', 'Unidad', '45.00'),
    ('010302', 'Galleta de Avena 250g', 'Horno Criollo', 'Empaquetado', '38.00'),
    ('020101', 'Jamón de Pierna Kg', 'Plumrose', 'Peso Variable', '385.00'),
    ('020101', 'Jamón Endiablado 150g', 'Plumrose', 'Empaquetado', '52.00'),
    ('020101', 'Jamón de Espalda Kg', 'Plumrose', 'Peso Variable', '268.00'),
    ('020102', 'Mortadela Especial Kg', 'Plumrose', 'Peso Variable', '145.00'),
    ('020102', 'Mortadela de Pollo Kg', 'Protinal', 'Peso Variable', '118.00'),
    ('020103', 'Salchichas Viena 500g', 'Plumrose', 'Empaquetado', '98.00'),
    ('020103', 'Salchichas de Pollo 500g', 'Protinal', 'Empaquetado', '82.00'),
    ('020103', 'Perro Caliente Ahumado 1kg', 'Plumrose', 'Empaquetado', '165.00'),
    ('020104', 'Chorizo Ahumado Kg', 'Plumrose', 'Peso Variable', '225.00'),
    ('020104', 'Chorizo Carupanero Kg', 'Selecta', 'Peso Variable', '198.00'),
    ('020104', 'Salchichón Cervecero Kg', 'Plumrose', 'Peso Variable', '242.00'),
    ('020201', 'Leche en Polvo Completa 900g', 'Los Andes', 'Empaquetado', '245.00'),
    ('020201', 'Leche Líquida UHT 1L', 'Los Andes', 'Empaquetado', '48.00'),
    ('020201', 'Leche Descremada 1L', 'Natulac', 'Empaquetado', '52.00'),
    ('020201', 'Leche Condensada 395g', 'Nestlé', 'Empaquetado', '78.00'),
    ('020202', 'Yogurt Natural 1kg', 'Natulac', 'Refrigerado', '88.00'),
    ('020202', 'Yogurt Bebible Fresa 1L', 'Los Andes', 'Refrigerado', '76.00'),
    ('020202', 'Yogurt Griego 150g', 'Natulac', 'Refrigerado', '42.00'),
    ('020203', 'Margarina 500g', 'Mavesa', 'Refrigerado', '68.00'),
    ('020203', 'Mantequilla con Sal 250g', 'Los Andes', 'Refrigerado', '95.00'),
    ('020301', 'Queso Blanco Duro Kg', 'La Campiña', 'Peso Variable', '298.00'),
    ('020301', 'Queso Guayanés Kg', 'La Campiña', 'Peso Variable', '342.00'),
    ('020301', 'Queso Llanero Kg', 'La Campiña', 'Peso Variable', '315.00'),
    ('020301', 'Ricotta 400g', 'Natulac', 'Refrigerado', '88.00'),
    ('020302', 'Queso Amarillo Kg', 'La Campiña', 'Peso Variable', '365.00'),
    ('020302', 'Queso Gouda Kg', 'Los Andes', 'Peso Variable', '412.00'),
    ('030101', 'Arroz Blanco Tipo I 1kg', 'Primor', 'Empaquetado', '32.00'),
    ('030101', 'Arroz Integral 1kg', 'Primor', 'Empaquetado', '45.00'),
    ('030101', 'Arroz Blanco 1kg', 'Diana', 'Empaquetado', '30.00'),
    ('030102', 'Caraotas Negras 1kg', 'Diana', 'Empaquetado', '52.00'),
    ('030102', 'Frijol Bayo 1kg', 'Diana', 'Empaquetado', '58.00'),
    ('030103', 'Lentejas 1kg', 'Diana', 'Empaquetado', '55.00'),
    ('030103', 'Arvejas Partidas 500g', 'Diana', 'Empaquetado', '32.00'),
    ('030103', 'Garbanzos 500g', 'Diana', 'Empaquetado', '48.00'),
    ('030104', 'Azúcar Refinada 1kg', 'Primor', 'Empaquetado', '38.00'),
    ('030104', 'Azúcar Morena 1kg', 'Primor', 'Empaquetado', '42.00'),
    ('030104', 'Sal Refinada 1kg', 'Selecta', 'Empaquetado', '12.00'),
    ('030201', 'Aceite de Maíz 1L', 'Mavesa', 'Empaquetado', '95.00'),
    ('030201', 'Aceite de Girasol 1L', 'Vatel', 'Empaquetado', '88.00'),
    ('030201', 'Aceite de Oliva Extra Virgen 500ml', 'Selecta', 'Empaquetado', '285.00'),
    ('030202', 'Mayonesa 910g', 'Mavesa', 'Empaquetado', '142.00'),
    ('030202', 'Salsa de Tomate 397g', 'Heinz', 'Empaquetado', '65.00'),
    ('030202', 'Mostaza 227g', 'Heinz', 'Empaquetado', '48.00'),
    ('030202', 'Salsa Inglesa 150ml', 'Heinz', 'Empaquetado', '55.00'),
    ('030301', 'Harina de Maíz Precocida 1kg', 'Polar', 'Empaquetado', '35.00'),
    ('030301', 'Harina de Maíz Integral 1kg', 'Polar', 'Empaquetado', '42.00'),
    ('030301', 'Harina de Maíz Amarilla 1kg', 'Polar', 'Empaquetado', '36.00'),
    ('030302', 'Harina de Trigo Leudante 1kg', 'Polar', 'Empaquetado', '38.00'),
    ('030302', 'Harina de Trigo Todo Uso 1kg', 'Polar', 'Empaquetado', '36.00'),
    ('030302', 'Maizina 400g', 'Maizina Americana', 'Empaquetado', '52.00'),
    ('030303', 'Pasta Larga Spaghetti 1kg', 'Primor', 'Empaquetado', '45.00'),
    ('030303', 'Pasta Corta Codito 500g', 'Primor', 'Empaquetado', '26.00'),
    ('030303', 'Pasta al Huevo 500g', 'Ronco', 'Empaquetado', '38.00'),
    ('030401', 'Atún Lomito en Aceite 140g', 'Margarita', 'Empaquetado', '58.00'),
    ('030401', 'Atún en Agua 140g', 'Margarita', 'Empaquetado', '56.00'),
    ('030401', 'Sardinas en Salsa de Tomate 170g', 'Margarita', 'Empaquetado', '38.00'),
    ('030402', 'Maíz Dulce en Grano 220g', 'Selecta', 'Empaquetado', '42.00'),
    ('030402', 'Arvejas Verdes 220g', 'Selecta', 'Empaquetado', '40.00'),
    ('030402', 'Champiñones Rebanados 184g', 'Selecta', 'Empaquetado', '78.00'),
    ('040101', 'Refresco Cola 2L', 'Coca-Cola', 'Empaquetado', '62.00'),
    ('040101', 'Refresco Cola 2L', 'Pepsi', 'Empaquetado', '58.00'),
    ('040101', 'Refresco Naranja 1.5L', 'Coca-Cola', 'Empaquetado', '48.00'),
    ('040101', 'Refresco Cola Lata 355ml', 'Coca-Cola', 'Unidad', '22.00'),
    ('040102', 'Jugo de Naranja 1L', 'Yukery', 'Empaquetado', '52.00'),
    ('040102', 'Néctar de Durazno 1L', 'Yukery', 'Empaquetado', '55.00'),
    ('040102', 'Jugo de Manzana 200ml', 'Yukery', 'Unidad', '18.00'),
    ('040201', 'Agua Mineral 5L', 'Minalba', 'Empaquetado', '65.00'),
    ('040201', 'Agua Mineral 1.5L', 'Minalba', 'Empaquetado', '25.00'),
    ('040201', 'Agua Mineral 600ml', 'Minalba', 'Unidad', '14.00'),
    ('040202', 'Malta 355ml', 'Polar', 'Unidad', '26.00'),
    ('040202', 'Malta Six Pack 6x222ml', 'Polar', 'Bulto', '138.00'),
    ('050101', 'Detergente en Polvo 1kg', 'Ariel', 'Empaquetado', '118.00'),
    ('050101', 'Detergente en Polvo 900g', 'Las Llaves', 'Empaquetado', '95.00'),
    ('050101', 'Jabón en Panela 250g', 'Las Llaves', 'Unidad', '22.00'),
    ('050102', 'Lavaplatos en Crema 500g', 'Las Llaves', 'Empaquetado', '48.00'),
    ('050102', 'Lavaplatos Líquido 750ml', 'Palmolive', 'Empaquetado', '72.00'),
    ('050103', 'Cloro 1L', 'Las Llaves', 'Empaquetado', '32.00'),
    ('050103', 'Desinfectante Pino 1L', 'Las Llaves', 'Empaquetado', '45.00'),
    ('050103', 'Limpiador Multiusos 900ml', 'Palmolive', 'Empaquetado', '68.00'),
    ('050201', 'Papel Higiénico 4 Rollos', 'Rosal', 'Empaquetado', '78.00'),
    ('050201', 'Papel Higiénico 12 Rollos', 'Rosal', 'Bulto', '215.00'),
    ('050202', 'Servilletas 100 Unidades', 'Rosal', 'Empaquetado', '32.00'),
    ('050202', 'Toallas de Cocina 2 Rollos', 'Rosal', 'Empaquetado', '65.00'),
    ('060101', 'Jabón de Baño 125g', 'Palmolive', 'Unidad', '28.00'),
    ('060101', 'Champú Anticaspa 400ml', 'Palmolive', 'Empaquetado', '135.00'),
    ('060101', 'Acondicionador 400ml', 'Palmolive', 'Empaquetado', '128.00'),
    ('060102', 'Crema Dental 100ml', 'Colgate', 'Empaquetado', '65.00'),
    ('060102', 'Cepillo Dental Medio', 'Colgate', 'Unidad', '42.00'),
    ('060102', 'Enjuague Bucal 250ml', 'Colgate', 'Empaquetado', '98.00'),
    ('060103', 'Desodorante Roll-On 50ml', 'Palmolive', 'Unidad', '78.00'),
    ('060103', 'Máquina de Afeitar 3 Unidades', 'Selecta', 'Empaquetado', '55.00'),
]


# ---------------------------------------------------------------------------
# Usuarios: (nombre, apellido, email, perfil, tiendas, ya_ingreso)
# ---------------------------------------------------------------------------

PROFILES = {
    'Administrador': [
        'view_product', 'manage_product', 'view_price', 'manage_price',
        'view_category', 'manage_category', 'view_store', 'manage_store',
        'view_user', 'manage_user',
    ],
    'Gerente de Precios': [
        'view_product', 'view_price', 'manage_price', 'view_store', 'view_category',
    ],
    'Analista de Productos': [
        'view_product', 'manage_product', 'view_category', 'manage_category',
        'view_price', 'view_store',
    ],
    'Coordinador de Categorías': [
        'view_category', 'manage_category', 'view_product', 'view_store',
    ],
    'Supervisor de Tienda': [
        'view_product', 'view_price', 'view_store',
    ],
    'Gerente de Operaciones': [
        'view_product', 'view_price', 'view_category', 'view_store',
        'manage_store', 'view_user', 'manage_user',
    ],
    'Consulta': [
        'view_product', 'view_price',
    ],
}

USERS = [
    ('María Fernanda', 'Rodríguez', 'mrodriguez', 'Gerente de Precios', 'all', True),
    ('Carlos Eduardo', 'Mendoza', 'cmendoza', 'Analista de Productos', 'all', True),
    ('Ana Gabriela', 'Pérez', 'aperez', 'Coordinador de Categorías', 'all', True),
    ('José Luis', 'Hernández', 'jhernandez', 'Supervisor de Tienda', [1, 2], True),
    ('Daniela Carolina', 'Rojas', 'drojas', 'Supervisor de Tienda', [3], True),
    ('Luis Alberto', 'Contreras', 'lcontreras', 'Gerente de Operaciones', 'all', True),
    ('Rosa Elena', 'Márquez', 'rmarquez', 'Consulta', [4, 5], False),
    ('Miguel Ángel', 'Sanchez', 'msanchez', 'Gerente de Precios', [5, 6, 7], True),
    ('Andreína', 'Villalobos', 'avillalobos', 'Supervisor de Tienda', [6], True),
    ('Jesús Rafael', 'Bermúdez', 'jbermudez', 'Analista de Productos', 'all', True),
    ('Carolina', 'Guerrero', 'cguerrero', 'Consulta', [7, 8], False),
    ('Pedro Antonio', 'Linares', 'plinares', 'Supervisor de Tienda', [8], True),
    ('Gabriela', 'Arteaga', 'garteaga', 'Administrador', 'all', True),
    ('Oscar David', 'Peña', 'opena', 'Gerente de Precios', [1, 2, 3, 4], True),
    ('Yorman', 'Escalona', 'yescalona', 'Supervisor de Tienda', [2, 3], False),
]

PRICE_COMMENTS = [
    'Ajuste por costo de proveedor',
    'Actualización de lista nacional',
    'Promoción quincenal',
    'Ajuste por tasa BCV',
    'Corrección de margen',
    'Precio de lanzamiento',
    'Ajuste estacional',
    'Alineación con competencia',
    'Revisión trimestral de precios',
    'Acuerdo comercial con proveedor',
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def ean13(serial):
    """Genera un codigo EAN-13 valido con prefijo de pais Venezuela (759)."""
    base = '759' + '0428' + str(serial).zfill(5)
    total = 0
    for index, digit in enumerate(base):
        total += int(digit) * (1 if index % 2 == 0 else 3)
    check = (10 - (total % 10)) % 10
    return base + str(check)


def money(value):
    return Decimal(value).quantize(Decimal('0.01'))


def seed_stores():
    stores = {}
    for number, name, address, _factor in STORES:
        store, _ = Store.objects.get_or_create(
            number=number, defaults={'name': name, 'address': address})
        stores[number] = store
    log('Tiendas: %d' % len(stores))
    return stores


def seed_categories():
    departments = {}
    for code, description in DEPARTMENTS:
        obj, _ = Department.objects.get_or_create(
            code=code, defaults={'description': description})
        departments[code] = obj

    groups = {}
    for code, description, dept_code in GROUPS:
        obj, _ = Group.objects.get_or_create(
            code=code,
            defaults={'description': description,
                      'department': departments[dept_code]})
        groups[code] = obj

    subgroups = {}
    for code, description, group_code in SUBGROUPS:
        obj, _ = Subgroup.objects.get_or_create(
            code=code,
            defaults={'description': description, 'group': groups[group_code]})
        subgroups[code] = obj

    brands = {}
    for name in BRANDS:
        obj, _ = Brand.objects.get_or_create(name=name)
        brands[name] = obj

    types = {}
    for name in PRODUCT_TYPES:
        obj, _ = ProductType.objects.get_or_create(name=name)
        types[name] = obj

    log('Departamentos: %d | Grupos: %d | Subgrupos: %d | Marcas: %d | Tipos: %d'
        % (len(departments), len(groups), len(subgroups), len(brands), len(types)))
    return subgroups, brands, types


def seed_products(subgroups, brands, types):
    products = []
    base_prices = {}
    for serial, (subgroup_code, description, brand, type_name, base) in enumerate(PRODUCTS, start=1):
        code = ean13(serial)
        product, _ = Product.objects.get_or_create(
            code=code,
            defaults={
                'description': description,
                'brand': brands[brand],
                'type': types[type_name],
                'subgroup': subgroups[subgroup_code],
            })
        products.append(product)
        base_prices[product.id] = money(base)
    log('Productos: %d' % len(products))
    return products, base_prices


def seed_users(stores):
    permissions = {p.name: p for p in Permission.objects.all()}
    created = []
    for first_name, last_name, alias, profile, assigned, has_logged_in in USERS:
        email = '%s@protinalproagro.com.ve' % alias
        user = User.objects.filter(email=email).first()
        if user is None:
            user = User.objects.create_user(
                email=email,
                first_name=first_name,
                last_name=last_name,
                password=DEMO_PASSWORD,
            )
        user.permissions.set([permissions[name] for name in PROFILES[profile]])

        if assigned == 'all':
            user.stores.set(list(stores.values()))
        else:
            user.stores.set([stores[number] for number in assigned])

        user.password_changed = has_logged_in
        if has_logged_in:
            user.last_login = NOW - timedelta(
                days=random.randint(0, 25), hours=random.randint(0, 23))
        user.save()
        created.append((user, profile))

    log('Usuarios: %d' % len(created))
    return created


# ---------------------------------------------------------------------------
# Precios de demostración: 2 vigentes, 2 vencidos y 2 programados.
#
# Los vencidos son el precio anterior de un producto cuyo sustituto sigue
# vigente, tal como encadena el modelo: la fecha de vencimiento de uno es la
# fecha de efectividad del siguiente.
# ---------------------------------------------------------------------------

DEMO_PRICES = [
    {
        'product': ('Pollo Entero Fresco Kg', 'Protinal'),
        'store': 1,
        'price': '162.40',
        'registered_days': -125,
        'effective_days': -117,
        'expiration_days': -20,
        'is_active': False,
        'comment': 'Ajuste por costo de proveedor',
    },
    {
        'product': ('Pollo Entero Fresco Kg', 'Protinal'),
        'store': 1,
        'price': '178.50',
        'registered_days': -27,
        'effective_days': -20,
        'expiration_days': None,
        'is_active': True,
        'comment': 'Actualización de lista nacional',
    },
    {
        'product': ('Harina de Maíz Precocida 1kg', 'Polar'),
        'store': 4,
        'price': '33.90',
        'registered_days': -111,
        'effective_days': -104,
        'expiration_days': -13,
        'is_active': False,
        'comment': 'Revisión trimestral de precios',
    },
    {
        'product': ('Harina de Maíz Precocida 1kg', 'Polar'),
        'store': 4,
        'price': '38.15',
        'registered_days': -18,
        'effective_days': -13,
        'expiration_days': None,
        'is_active': True,
        'comment': 'Ajuste por tasa BCV',
    },
    {
        'product': ('Queso Guayanés Kg', 'La Campiña'),
        'store': 2,
        'price': '348.00',
        'registered_days': -4,
        'effective_days': 8,
        'expiration_days': None,
        'is_active': False,
        'comment': 'Precio de lanzamiento',
    },
    {
        'product': ('Refresco Cola 2L', 'Coca-Cola'),
        'store': 5,
        'price': '64.50',
        'registered_days': -2,
        'effective_days': 17,
        'expiration_days': None,
        'is_active': False,
        'comment': 'Promoción quincenal',
    },
]


def find_product(products, description, brand_name):
    """Ubica un producto por descripción y marca dentro del catálogo cargado."""
    for serial, entry in enumerate(PRODUCTS, start=1):
        if entry[1] == description and entry[2] == brand_name:
            return products[serial - 1]
    raise ValueError('Producto no encontrado: %s (%s)' % (description, brand_name))


def seed_prices(stores, products, base_prices, users):
    """Crea el conjunto reducido de precios de demostración."""
    price_editors = [
        user for user, profile in users
        if 'manage_price' in PROFILES[profile]
    ]

    def pick_editor(store):
        """Elige un usuario con permiso de precios que tenga la tienda asignada."""
        candidates = [
            user for user in price_editors
            if user.stores.filter(pk=store.pk).exists()
        ]
        if not candidates:
            candidates = [User.objects.filter(is_superuser=True).first()]
        return random.choice(candidates)

    def offset(days):
        return NOW + timedelta(days=days, hours=random.randint(0, 6),
                               minutes=random.choice([0, 15, 30, 45]))

    # auto_now_add impide fijar registration_date; se desactiva durante la carga
    registration_field = Price._meta.get_field('registration_date')
    registration_field.auto_now_add = False

    counters = {'expired': 0, 'active': 0, 'scheduled': 0}

    try:
        for entry in DEMO_PRICES:
            description, brand_name = entry['product']
            product = find_product(products, description, brand_name)
            store = stores[entry['store']]

            expiration = (None if entry['expiration_days'] is None
                          else offset(entry['expiration_days']))

            Price.objects.create(
                product=product,
                store=store,
                price=money(entry['price']),
                registration_date=offset(entry['registered_days']),
                effective_date=offset(entry['effective_days']),
                expiration_date=expiration,
                is_active=entry['is_active'],
                comment=entry['comment'],
                created_by=pick_editor(store),
            )

            if entry['is_active']:
                counters['active'] += 1
            elif entry['effective_days'] > 0:
                counters['scheduled'] += 1
            else:
                counters['expired'] += 1
    finally:
        registration_field.auto_now_add = True

    log('Precios: %d (vencidos: %d | vigentes: %d | programados: %d)'
        % (len(DEMO_PRICES), counters['expired'], counters['active'],
           counters['scheduled']))


def main():
    reset = '--reset' in sys.argv

    if reset:
        log('Limpiando precios, productos y catalogos previos...')
        Price.objects.all().delete()
        Product.objects.all().delete()

    if Price.objects.exists():
        log('Ya existen precios cargados. Use --reset para regenerarlos.')
        return

    stores = seed_stores()
    subgroups, brands, types = seed_categories()
    products, base_prices = seed_products(subgroups, brands, types)
    users = seed_users(stores)
    seed_prices(stores, products, base_prices, users)

    log('')
    log('Carga completada.')
    log('Contrasena de los usuarios de demostracion: %s' % DEMO_PASSWORD)


if __name__ == '__main__':
    main()
