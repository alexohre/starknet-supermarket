// Contract ABIs and addresses

// Supermarket contract address on Starknet Sepolia
export const SUPERMARKET_CONTRACT_ADDRESS = "0x07105ca8ab2ee5e3cff54bf1803bcd24dabd8a54af659ea00a26315488891fc7";

// Basic ABI for the Supermarket contract
// This is a placeholder - replace with the actual ABI of your contract
export const SUPERMARKET_ABI = [
  {
    "type": "impl",
    "name": "SuperMarketImpl",
    "interface_name": "super_market::interfaces::ISuper_market::ISuperMarket"
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::byte_array::ByteArray",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "struct",
    "name": "super_market::contracts::super_market::Product",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32"
      },
      {
        "name": "name",
        "type": "core::felt252"
      },
      {
        "name": "price",
        "type": "core::integer::u32"
      },
      {
        "name": "stock",
        "type": "core::integer::u32"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "category",
        "type": "core::felt252"
      },
      {
        "name": "image",
        "type": "core::byte_array::ByteArray"
      }
    ]
  },
  {
    "type": "struct",
    "name": "super_market::contracts::super_market::PurchaseItem",
    "members": [
      {
        "name": "product_id",
        "type": "core::integer::u32"
      },
      {
        "name": "quantity",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "struct",
    "name": "super_market::contracts::super_market::OrderItem",
    "members": [
      {
        "name": "product_id",
        "type": "core::integer::u32"
      },
      {
        "name": "quantity",
        "type": "core::integer::u32"
      },
      {
        "name": "price",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "struct",
    "name": "super_market::contracts::super_market::Order",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32"
      },
      {
        "name": "buyer",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "total_cost",
        "type": "core::integer::u32"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64"
      },
      {
        "name": "items_count",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "interface",
    "name": "super_market::interfaces::ISuper_market::ISuperMarket",
    "items": [
      {
        "type": "function",
        "name": "transfer_ownership",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "add_admin",
        "inputs": [
          {
            "name": "admin",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "remove_admin",
        "inputs": [
          {
            "name": "admin",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "is_admin",
        "inputs": [
          {
            "name": "address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_owner",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_admins",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_admin_count",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "withdraw_funds",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "add_product",
        "inputs": [
          {
            "name": "name",
            "type": "core::felt252"
          },
          {
            "name": "price",
            "type": "core::integer::u32"
          },
          {
            "name": "stock",
            "type": "core::integer::u32"
          },
          {
            "name": "description",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "category",
            "type": "core::felt252"
          },
          {
            "name": "image",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "update_product",
        "inputs": [
          {
            "name": "id",
            "type": "core::integer::u32"
          },
          {
            "name": "name",
            "type": "core::felt252"
          },
          {
            "name": "price",
            "type": "core::integer::u32"
          },
          {
            "name": "stock",
            "type": "core::integer::u32"
          },
          {
            "name": "description",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "category",
            "type": "core::felt252"
          },
          {
            "name": "image",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_prdct_id",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "delete_product",
        "inputs": [
          {
            "name": "id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_products",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<super_market::contracts::super_market::Product>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_total_sales",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "buy_product",
        "inputs": [
          {
            "name": "purchases",
            "type": "core::array::Array::<super_market::contracts::super_market::PurchaseItem>"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_order_items",
        "inputs": [
          {
            "name": "order_id",
            "type": "core::integer::u32"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<super_market::contracts::super_market::OrderItem>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_all_orders",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<super_market::contracts::super_market::Order>"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::ProductCreated",
    "kind": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "name",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "price",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "stock",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      },
      {
        "name": "category",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "image",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::ProductUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "name",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "price",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "stock",
        "type": "core::integer::u32",
        "kind": "data"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      },
      {
        "name": "category",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "image",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::ProductDeleted",
    "kind": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u32",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::ProductPurchased",
    "kind": "struct",
    "members": [
      {
        "name": "buyer",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "total_cost",
        "type": "core::integer::u32",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::AdminAdded",
    "kind": "struct",
    "members": [
      {
        "name": "admin",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::AdminRemoved",
    "kind": "struct",
    "members": [
      {
        "name": "admin",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::events::super_market_event::OwnershipTransferred",
    "kind": "struct",
    "members": [
      {
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "super_market::contracts::super_market::SuperMarket::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "ProductCreated",
        "type": "super_market::events::super_market_event::ProductCreated",
        "kind": "nested"
      },
      {
        "name": "ProductUpdated",
        "type": "super_market::events::super_market_event::ProductUpdated",
        "kind": "nested"
      },
      {
        "name": "ProductDeleted",
        "type": "super_market::events::super_market_event::ProductDeleted",
        "kind": "nested"
      },
      {
        "name": "ProductPurchased",
        "type": "super_market::events::super_market_event::ProductPurchased",
        "kind": "nested"
      },
      {
        "name": "AdminAdded",
        "type": "super_market::events::super_market_event::AdminAdded",
        "kind": "nested"
      },
      {
        "name": "AdminRemoved",
        "type": "super_market::events::super_market_event::AdminRemoved",
        "kind": "nested"
      },
      {
        "name": "OwnershipTransferred",
        "type": "super_market::events::super_market_event::OwnershipTransferred",
        "kind": "nested"
      }
    ]
  }
];

// Helper function to format Starknet addresses for display
export function formatAddress(address?: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper function to convert wei to ETH with formatting
export function formatEther(value?: string): string {
  if (!value) return "0";
  return (Number(value) / 1e18).toFixed(4);
}
