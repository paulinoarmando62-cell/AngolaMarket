# AngolaMarket — Guia de Configuração Supabase & Arquitetura de Dados

Este documento descreve a estrutura de banco de dados, autenticação e segurança com **Row Level Security (RLS)** preparada para o **AngolaMarket**.

---

## 1. Como Conectar ao Supabase

1. Crie um projeto no painel do [Supabase](https://supabase.com).
2. No menu lateral, aceda ao **SQL Editor**.
3. Abra o ficheiro `supabase-schema.sql` gerado na raiz deste projeto, copie todo o conteúdo e execute-o (`Run`).
4. Obtenha as credenciais em **Project Settings > API**:
   - `Project URL`
   - `anon / public key`
5. Adicione as variáveis no seu ficheiro `.env`:
   ```bash
   VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
   VITE_SUPABASE_ANON_KEY="sua-chave-anon-aqui"
   ```

---

## 2. Tabelas Criadas no `supabase-schema.sql`

| Tabela | Finalidade |
| :--- | :--- |
| `profiles` | Perfis de utilizadores (`admin`, `producer`, `affiliate`, `client`) vinculados ao `auth.users`. |
| `categories` | Categorias e subcategorias dinâmicas geridas pelo Administrador. |
| `delivery_zones` | Zonas de entrega e preçários configuráveis (Talatona, Kilamba, Viana, Cacuaco, etc.). |
| `products` | Catálogo de produtos com preços em Kwanzas (Kz), stock, produtor e comissão de afiliado. |
| `product_images` | Galeria de imagens dos produtos. |
| `affiliates` | Carteiras e registo de afiliados, cliques, vendas e comissões acumuladas. |
| `orders` | Encomendas com numeração única (`AM-2026-XXXXXX`), morada e métodos de pagamento. |
| `order_items` | Itens encomendados e comissão atribuída por artigo. |
| `affiliate_sales` | Vendas registadas através de links com código de referência (`?ref=AF-XXXX`). |
| `withdrawals` | Pedidos de levantamento de comissões (Multicaixa Express, PayPay, IBAN, Unitel Money). |
| `coupons` | Códigos promocionais com desconto percentual ou fixo. |
| `platform_settings` | Taxa da plataforma (padrão 10%), taxa de levantamento (2%) e métodos de pagamento ativos. |
| `notifications` | Notificações internas do sistema para clientes, produtores e administradores. |

---

## 3. Políticas de Segurança (Row Level Security - RLS)

- **Leitura Pública**: Clientes podem consultar produtos aprovados, categorias e zonas de entrega ativas.
- **Produtores**: Têm permissão para criar, editar e desativar apenas os seus próprios produtos.
- **Afiliados**: Podem consultar exclusivamente o seu saldo, cliques e histórico de comissões.
- **Clientes**: Acedem unicamente aos seus próprios pedidos e dados de faturação.
- **Administrador**: Possui acesso total e irrestrito (`ALL`) verificado através da função `is_admin()`.

---

## 4. Métodos de Pagamento em Angola Integrados

1. **Multicaixa Express**: Referências de pagamento ou notificações no telemóvel.
2. **PayPay África**: Carteira móvel digital.
3. **Transferência Bancária (IBAN)**: Processamento e conferência manual de comprovativo.
4. **Pagamento na Entrega**: Cobrança em dinheiro ou TPA pelo estafeta.
