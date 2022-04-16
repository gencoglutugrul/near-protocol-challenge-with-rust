use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, setup_alloc};

setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Welcome;

impl Default for Welcome {
    fn default() -> Self {
        Self
    }
}

#[near_bindgen]
impl Welcome {
    pub fn get_greeting(&self, name: String) -> String {
        String::from(format!("Hello, {}", name))
    }
}
