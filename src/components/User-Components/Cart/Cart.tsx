import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart, deleteCartItem } from "../../../services/api";
import type { Cart as CartData } from "../../../services/api";
import Navbar from "../../Reusable-Components/Navbar/Navbar";
import Footer from "../../Reusable-Components/Footer/Footer";
import "./Cart.css";

function Cart() {
	const [cart, setCart] = useState<CartData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
	const [error, setError] = useState("");

	useEffect(() => {
		async function loadCart() {
			try {
				setError("");
				setCart(await getCart());
			} catch (requestError) {
				setError(requestError instanceof Error ? requestError.message : "Unable to load your cart.");
			} finally {
				setIsLoading(false);
			}
		}

		loadCart();
	}, []);

	const totalPrice = cart?.items.reduce(
		(total, item) => total + item.price * item.quantity,
		0,
	) ?? 0;

	const handleDeleteItem = async (itemId: string) => {
		setDeletingItemId(itemId);
		setError("");

		try {
			await deleteCartItem(itemId);
			setCart((currentCart) => currentCart
				? { ...currentCart, items: currentCart.items.filter((item) => item.id !== itemId) }
				: currentCart);
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "Unable to delete this cart item.");
		} finally {
			setDeletingItemId(null);
		}
	};

	if (isLoading) {
		return <main className="cart-page cart-page--state">Loading cart...</main>;
	}

	return (
		<>
			<Navbar />
			<main className="cart-page" aria-labelledby="cart-title">
				<section className="cart-page__content">
					<p className="cart-page__eyebrow">Your collection</p>
					<h1 id="cart-title">Shopping cart</h1>
					{error && <p className="cart-message cart-message--error" role="alert">{error}</p>}
					{cart?.items.length ? (
						<>
							<div className="cart-items">
								{cart.items.map((item) => (
									<article className="cart-item" key={item.id}>
										<div className="cart-item__image-wrap">
											{item.imageURL ? (
												<img src={item.imageURL} alt={`${item.gameName} cover`} className="cart-item__image" />
											) : (
												<span className="cart-item__image-fallback" aria-hidden="true">?</span>
											)}
										</div>
										<div>
											<h2>{item.gameName}</h2>
											<p>${item.price.toFixed(2)} x {item.quantity}</p>
										</div>
										<div className="cart-item__actions">
											<strong>${(item.price * item.quantity).toFixed(2)}</strong>
											<button
												type="button"
												className="cart-item__delete"
												onClick={() => handleDeleteItem(item.id)}
												disabled={deletingItemId === item.id}
											>
												{deletingItemId === item.id ? "Deleting..." : "Delete"}
											</button>
										</div>
									</article>
								))}
							</div>
							<div className="cart-summary">
								<strong>Total: ${totalPrice.toFixed(2)}</strong>
								<Link to="/order-placement" className="cart-summary__order">
									Place an order
								</Link>
							</div>
						</>
					) : (
						<p className="cart-empty">Your cart is empty.</p>
					)}
				</section>
			</main>
			<Footer />
		</>
	);
}

export default Cart;
