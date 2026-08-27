import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
	createOrder,
	getCart,
	type Cart,
	type Order,
} from "../../services/api";
import Navbar from "../../components/Reusable-Components/Navbar/Navbar";
import Footer from "../../components/Reusable-Components/Footer/Footer";
import "./OrderPlacement.css";

type PaymentMethod = "creditCard" | "paypal";

interface CardForm {
	cardNumber: string;
	cardholderName: string;
	expiryDate: string;
	cvv: string;
}

const EMPTY_CARD_FORM: CardForm = {
	cardNumber: "",
	cardholderName: "",
	expiryDate: "",
	cvv: "",
};

function isValidExpiry(value: string) {
	const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
	if (!match) return false;

	const currentDate = new Date();
	const expiryMonth = Number(match[1]);
	const expiryYear = 2000 + Number(match[2]);
	return expiryYear > currentDate.getFullYear()
		|| (expiryYear === currentDate.getFullYear() && expiryMonth >= currentDate.getMonth() + 1);
}

function isCardFormValid(card: CardForm) {
	const cardDigits = card.cardNumber.replace(/\s/g, "");
	return /^\d{16,19}$/.test(cardDigits)
		&& card.cardholderName.trim().length > 0
		&& isValidExpiry(card.expiryDate)
		&& /^\d{3,4}$/.test(card.cvv);
}

function formatPaymentMethod(paymentMethod: Order["paymentMethod"]) {
	return paymentMethod === 1 || paymentMethod === "PayPal" || paymentMethod === "paypal"
		? "PayPal"
		: "Credit Card";
}

function OrderPlacement() {
	const [cart, setCart] = useState<Cart | null>(null);
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
	const [cardForm, setCardForm] = useState<CardForm>(EMPTY_CARD_FORM);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

	useEffect(() => {
		async function loadCart() {
			try {
				setCart(await getCart());
			} catch (requestError) {
				setError(requestError instanceof Error ? requestError.message : "Unable to load your cart.");
			} finally {
				setIsLoading(false);
			}
		}

		loadCart();
	}, []);

	const cardIsValid = paymentMethod !== "creditCard" || isCardFormValid(cardForm);
	const canSubmit = paymentMethod !== "" && Boolean(cart?.items.length) && cardIsValid && !isSubmitting;
	const cartTotal = cart?.items.reduce((total, item) => total + item.price * item.quantity, 0) ?? 0;

	const handleCardChange = (field: keyof CardForm, value: string) => {
		setCardForm((current) => ({ ...current, [field]: value }));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!canSubmit) return;

		setError("");
		setIsSubmitting(true);

		try {
			// The API derives the user and cart items from the authenticated request.
			const order = await createOrder({ paymentMethod: paymentMethod === "creditCard" ? 0 : 1 });
			setCompletedOrder(order);
			setCart((current) => current ? { ...current, items: [] } : current);
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "Unable to place your order.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return <main className="order-page order-page--state">Loading checkout...</main>;
	}

	return (
		<div className="order-page">
			<Navbar />
			<main className="order-page__main" aria-labelledby="order-title">
				{completedOrder ? (
					<section className="order-confirmation">
						<p className="order-page__eyebrow">Order complete</p>
						<h1 id="order-title">Thanks for your order.</h1>
						<p className="order-confirmation__id">Order ID: {completedOrder.id}</p>
						<div className="order-confirmation__summary">
							<div>
								<span>Payment</span>
								<strong>{formatPaymentMethod(completedOrder.paymentMethod)}</strong>
							</div>
							<div>
								<span>Total</span>
								<strong>${completedOrder.totalPrice.toFixed(2)}</strong>
							</div>
						</div>
						<div className="order-confirmation__items">
							{completedOrder.items.map((item) => (
								<div key={item.id}>
											<span>{item.gameName}</span>
									<span>{item.quantity} x ${item.unitPrice.toFixed(2)}</span>
								</div>
							))}
						</div>
						<Link to="/games" className="order-page__button">Continue shopping</Link>
					</section>
				) : (
					<section className="order-layout">
						<div className="order-form-column">
							<Link to="/cart" className="order-page__back">&lt;- Back to cart</Link>
							<p className="order-page__eyebrow">Secure checkout</p>
							<h1 id="order-title">Place your order</h1>
							{error && <p className="order-page__error" role="alert">{error}</p>}

							{!cart?.items.length ? (
								<div className="order-page__empty">
									<p>Your cart is empty.</p>
									<Link to="/games">Browse games</Link>
								</div>
							) : (
								<form onSubmit={handleSubmit}>
									<fieldset className="payment-methods">
										<legend>Choose payment method</legend>
										<label className={paymentMethod === "creditCard" ? "is-selected" : ""}>
											<input
												type="radio"
												name="paymentMethod"
												value="creditCard"
												checked={paymentMethod === "creditCard"}
												onChange={() => setPaymentMethod("creditCard")}
											/>
											<span>Credit Card</span>
										</label>
										<label className={paymentMethod === "paypal" ? "is-selected" : ""}>
											<input
												type="radio"
												name="paymentMethod"
												value="paypal"
												checked={paymentMethod === "paypal"}
												onChange={() => setPaymentMethod("paypal")}
											/>
											<span>PayPal</span>
										</label>
									</fieldset>

									{paymentMethod === "creditCard" && (
										<div className="card-fields">
											<label>
												Card Number
												<input
													inputMode="numeric"
													autoComplete="off"
													value={cardForm.cardNumber}
													onChange={(event) => handleCardChange("cardNumber", event.target.value)}
													placeholder="1234 5678 9012 3456"
												/>
											</label>
											<label>
												Cardholder Name
												<input
													autoComplete="off"
													value={cardForm.cardholderName}
													onChange={(event) => handleCardChange("cardholderName", event.target.value)}
													placeholder="Name on card"
												/>
											</label>
											<div className="card-fields__row">
												<label>
													Expiry Date
													<input
														inputMode="numeric"
														autoComplete="off"
														maxLength={5}
														value={cardForm.expiryDate}
														onChange={(event) => handleCardChange("expiryDate", event.target.value)}
														placeholder="MM/YY"
													/>
												</label>
												<label>
													CVV
													<input
														inputMode="numeric"
														autoComplete="off"
														maxLength={4}
														value={cardForm.cvv}
														onChange={(event) => handleCardChange("cvv", event.target.value)}
														placeholder="123"
													/>
												</label>
											</div>
											{!cardIsValid && <p className="card-fields__hint">Enter valid card details to continue.</p>}
										</div>
									)}

									<button type="submit" className="order-page__button" disabled={!canSubmit}>
										{isSubmitting ? "Placing order..." : "Place order"}
									</button>
								</form>
							)}
						</div>

						<aside className="order-summary" aria-label="Order summary">
							<p className="order-page__eyebrow">Your order</p>
							{cart?.items.map((item) => (
								<div className="order-summary__item" key={item.id}>
									<div>
										<strong>{item.gameName}</strong>
										<span>Qty {item.quantity}</span>
									</div>
									<strong>${(item.price * item.quantity).toFixed(2)}</strong>
								</div>
							))}
							<div className="order-summary__total">
								<span>Total</span>
								<strong>${cartTotal.toFixed(2)}</strong>
							</div>
						</aside>
					</section>
				)}
			</main>
			<Footer />
		</div>
	);
}

export default OrderPlacement;
