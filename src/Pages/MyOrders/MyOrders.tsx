import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	cancelOrder,
	getOrdersByUserId,
	type Order,
} from "../../services/api";
import Navbar from "../../components/Reusable-Components/Navbar/Navbar";
import Footer from "../../components/Reusable-Components/Footer/Footer";
import "./MyOrders.css";

function formatPaymentMethod(paymentMethod: Order["paymentMethod"]) {
	return paymentMethod === 1 || paymentMethod === "PayPal" || paymentMethod === "paypal"
		? "PayPal"
		: "Credit Card";
}

function MyOrders() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		async function loadOrders() {
			try {
				setError("");
				setOrders(await getOrdersByUserId());
			} catch (requestError) {
				setError(requestError instanceof Error ? requestError.message : "Unable to load your orders.");
			} finally {
				setIsLoading(false);
			}
		}

		loadOrders();
	}, []);

	const handleCancelOrder = async (orderId: string) => {
		if (!window.confirm("Are you sure you want to cancel this order?")) return;

		setCancellingOrderId(orderId);
		setError("");
		setSuccessMessage("");

		try {
			await cancelOrder(orderId);
			setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));
			setSuccessMessage("Order cancelled successfully.");
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : "Unable to cancel this order.");
		} finally {
			setCancellingOrderId(null);
		}
	};

	if (isLoading) {
		return <main className="my-orders my-orders--state">Loading your orders...</main>;
	}

	return (
		<div className="my-orders-page">
			<Navbar />
			<main className="my-orders" aria-labelledby="my-orders-title">
				<header className="my-orders__header">
					<p className="my-orders__eyebrow">Your account</p>
					<h1 id="my-orders-title">My orders</h1>
					<p>Review your purchases and manage recent orders.</p>
				</header>

				{error && <p className="my-orders__message my-orders__message--error" role="alert">{error}</p>}
				{successMessage && <p className="my-orders__message" role="status">{successMessage}</p>}

				{orders.length === 0 ? (
					<section className="my-orders__empty">
						<h2>No orders yet</h2>
						<p>Your completed purchases will appear here.</p>
						<Link to="/games">Browse games</Link>
					</section>
				) : (
					<section className="orders-list" aria-label="Your orders">
						{orders.map((order, index) => (
							<article className="order-card" key={order.id}>
								<div className="order-card__header">
									<div>
										<p className="order-card__number">Order {String(index + 1).padStart(2, "0")}</p>
										<h2>{order.id}</h2>
									</div>
									<span className="order-card__payment">{formatPaymentMethod(order.paymentMethod)}</span>
								</div>

								<div className="order-card__items">
									<div className="order-card__items-heading">
										<span>Order items</span>
										<span>{order.items.length} {order.items.length === 1 ? "item" : "items"}</span>
									</div>
									{order.items.map((item) => (
										<div className="order-item" key={item.id}>
											<div>
												<strong>{item.gameName}</strong>
												<span>Quantity: {item.quantity}</span>
											</div>
											<span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
										</div>
									))}
								</div>

								<div className="order-card__footer">
									<div>
										<span>Total</span>
										<strong>${order.totalPrice.toFixed(2)}</strong>
									</div>
									<button
										type="button"
										className="order-card__cancel"
										onClick={() => handleCancelOrder(order.id)}
										disabled={cancellingOrderId === order.id}
									>
										{cancellingOrderId === order.id ? "Cancelling..." : "Cancel order"}
									</button>
								</div>
							</article>
						))}
					</section>
				)}
			</main>
			<Footer />
		</div>
	);
}

export default MyOrders;
