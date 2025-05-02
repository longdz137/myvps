document.addEventListener('DOMContentLoaded', function() {
    // Xử lý chọn gói VPS
    const selectPlanButtons = document.querySelectorAll('.select-plan');
    const orderForm = document.getElementById('order-form');
    const planInput = document.getElementById('plan');
    const selectedPlanInput = document.getElementById('selectedPlanInput');
    const totalInput = document.getElementById('total');
    const durationSelect = document.getElementById('duration');
    
    // Bảng giá các gói
    const planPrices = {
        'VPS Cơ Bản': 500000,
        'VPS Nâng Cao': 900000,
        'VPS Doanh Nghiệp': 1500000
    };
    
    // Xử lý khi nhấn nút chọn gói
    selectPlanButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planName = this.getAttribute('data-plan');
            
            // Hiển thị form đặt hàng
            orderForm.classList.remove('hidden');
            
            // Điền thông tin gói đã chọn
            planInput.value = planName;
            selectedPlanInput.value = planName;
            
            // Cuộn đến form
            orderForm.scrollIntoView({ behavior: 'smooth' });
            
            // Tính toán tổng tiền
            calculateTotal();
        });
    });
    
    // Tính toán tổng tiền khi thay đổi thời hạn
    durationSelect.addEventListener('change', calculateTotal);
    
    // Hàm tính tổng tiền
    function calculateTotal() {
        const selectedPlan = planInput.value;
        const duration = durationSelect.value;
        let price = planPrices[selectedPlan];
        let discount = 0;
        
        // Áp dụng giảm giá theo thời hạn
        if (duration === '3 tháng') {
            discount = 0.05;
        } else if (duration === '6 tháng') {
            discount = 0.1;
        } else if (duration === '12 tháng') {
            discount = 0.15;
        }
        
        // Tính tổng tiền
        let months = parseInt(duration);
        if (isNaN(months)) months = 1;
        
        const total = price * months * (1 - discount);
        
        // Hiển thị tổng tiền
        totalInput.value = formatCurrency(total) + ' (' + duration + ')';
    }
    
    // Hàm định dạng tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(amount);
    }
    
    // Xử lý submit form
    const orderFormElement = document.getElementById('vpsOrderForm');
    orderFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Gửi form bằng FormSubmit
        fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
        })
        .then(response => {
            if (response.ok) {
                alert('Đơn đặt hàng của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
                orderFormElement.reset();
                orderForm.classList.add('hidden');
            } else {
                throw new Error('Có lỗi xảy ra khi gửi đơn đặt hàng.');
            }
        })
        .catch(error => {
            alert(error.message);
        });
    });
});