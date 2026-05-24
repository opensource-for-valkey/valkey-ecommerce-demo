export interface PaymentInput {
  outcome?: "success" | "decline" | "error";
}

export interface PaymentResult {
  status: "authorized" | "declined" | "error";
  transactionId: string | null;
}

export async function processStubPayment(orderId: string, input: PaymentInput = {}): Promise<PaymentResult> {
  if (input.outcome === "error") {
    throw new Error("stub_payment_processor_error");
  }

  if (input.outcome === "decline") {
    return {
      status: "declined",
      transactionId: null,
    };
  }

  return {
    status: "authorized",
    transactionId: `stub_txn_${orderId.replace(/[^a-zA-Z0-9]/g, "_")}`,
  };
}
