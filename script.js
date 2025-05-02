document.addEventListener('DOMContentLoaded', function() {
    // Xử lý khi click nút chọn gói
    const selectButtons = document.querySelectorAll('.btn-select');
    const orderForm = document.getElementById('orderForm');
    const planSelect = document.getElementById('plan');
    const selectedPlanInput = document.getElementById('selectedPlanInput');
    
    selectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            planSelect.value = plan;
            selectedPlanInput.value = plan;
            
            // Cuộn đến form đặt hàng
            orderForm.scrollIntoView({ behavior: 'smooth' });
            
            // Tính toán lại tổng tiền
            calculateTotal();
        });
    });
    
    // Tính toán tổng tiền khi thay đổi gói hoặc thời gian
    const durationSelect = document.getElementById('duration');
    planSelect.addEventListener('change', calculateTotal);
    durationSelect.addEventListener('change', calculateTotal);
    
    function calculateTotal() {
        const plan = planSelect.value;
        const duration = durationSelect.value;
        
        if (!plan) {
            document.getElementById('totalAmount').textContent = '0 đ';
            return;
        }
        
        let basePrice = 0;
        
        // Xác định giá cơ bản theo gói
        switch(plan) {
            case 'VPS Cơ Bản':
                basePrice = 499000;
                break;
            case 'VPS Nâng Cao':
                basePrice = 899000;
                break;
            case 'VPS Doanh Nghiệp':
                basePrice = 1499000;
                break;
        }
        
        // Xác định số tháng và tỷ lệ giảm giá
        let months = 1;
        let discount = 0;
        
        if (duration.includes('3 tháng')) {
            months = 3;
            discount = 0.05;
        } else if (duration.includes('6 tháng')) {
            months = 6;
            discount = 0.1;
        } else if (duration.includes('12 tháng')) {
            months = 12;
            discount = 0.15;
        }
        
        // Tính toán tổng tiền
        const total = basePrice * months * (1 - discount);
        
        // Hiển thị tổng tiền
        document.getElementById('totalAmount').textContent = total.toLocaleString('vi-VN') + ' đ';
    }
    
    // Xử lý submit form
    const orderForm = document.getElementById('vpsOrderForm');
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Kiểm tra các trường bắt buộc
        const requiredFields = this.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '#ddd';
            }
        });
        
        if (!isValid) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }
        
        // Gửi form bằng FormSubmit
        fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Đơn đặt hàng của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
                orderForm.reset();
                document.getElementById('totalAmount').textContent = '0 đ';
            } else {
                throw new Error('Lỗi khi gửi form');
            }
        })
        .catch(error => {
            alert('Có lỗi xảy ra khi gửi đơn đặt hàng. Vui lòng thử lại sau!');
            console.error('Error:', error);
        });
    });
});
