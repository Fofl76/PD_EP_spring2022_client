<template>
	<div class="DataPreloader">
		<div class="DataPreloader-smile">≧◉◡◉≦</div>
		<div class="DataPreloader-title">Нет данных</div>
		<div class="DataPreloader-subtitle">Выберите факультет и направление</div>
	</div>
</template>

<script>
export default {
	name: 'DataPreloader',
}
</script>

<style lang="sass">
.DataPreloader
    color: #fff
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center

    &-smile
        user-select: none
        font-size: 30px
        margin-bottom: 16px
        width: 150px
        height: 150px
        background-color: #272727
        padding: 10px
        display: flex
        align-items: center
        justify-content: center
        border-radius: 50%

    &-title
        font-size: 25px
        margin-bottom: 0px

    &-subtitle
        font-size: 20px
        color: #a8a8a8
        font-weight: 300
</style>
