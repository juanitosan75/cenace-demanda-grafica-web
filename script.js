// URL de la API Gateway
const apiUrl = 'https://svvjhlf32d.execute-api.us-east-1.amazonaws.com/prod/datos';

// ===============================
// Obtener datos desde la API
// ===============================
async function fetchData() {
    const dateInput = document.getElementById('date').value;
    const apiUrlWithDate = `${apiUrl}?date=${dateInput}`;

    try {
        const response = await fetch(apiUrlWithDate);
        if (!response.ok) throw new Error('Error en la API');

        const data = await response.json();
        renderChart(data, dateInput);

    } catch (error) {
        console.error('Error al obtener datos:', error);
        alert('No se pudieron cargar los datos para la fecha seleccionada.');
    }
}

// ===============================
// Renderizar gráfica
// ===============================
function renderChart(data, date) {
    const ctx = document.getElementById('myChart').getContext('2d');

    document.querySelector('h1').textContent =
        `Demanda, Generación y Pronóstico del SIN - ${formatDate(date)}`;

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.hora,
            datasets: [
                {
                    label: 'Demanda (MW)',
                    data: data.demanda,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                    tension: 0.4,
                    borderWidth: 2
                },
                {
                    label: 'Generación (MW)',
                    data: data.generacion,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    tension: 0.4,
                    borderWidth: 2
                },
                {
                    label: 'Pronóstico (MW)',
                    data: data.pronostico,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    fill: false,
                    tension: 0.4,
                    borderWidth: 2,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { size: 14 } }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Hora del Día',
                        font: { size: 14 }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Megavatios (MW)',
                        font: { size: 14 }
                    },
                    beginAtZero: false,
                    suggestedMin: 35000,
                    suggestedMax: 47000
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// ===============================
// Formatear fecha
// ===============================
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===============================
// Establecer fecha actual automáticamente
// ===============================
function setTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;

    document.getElementById('date').value = formattedToday;
}

// ===============================
// Ejecutar cuando cargue la página
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    setTodayDate();
    fetchData();
    setInterval(fetchData, 3600000);
});