import nanoexpress from 'nanoexpress'
import staticServe from '@nanoexpress/middleware-static-serve'
import path from 'path'
import addBinary from './helpers/addBinary.js'

const app = nanoexpress()
app.use(staticServe(path.resolve('./www')))

/** Isso é apenas uma rota para renderizar o html, caso queira apenas a API pode deletar isso e pasta www */
app.get('/', (req, res) => {
	res.render('index.html')
})

/** Isso é apenas uma rota para obter o CSS, caso queira apenas a API pode deletar isso. */
app.get('/css.css', (req, res) => {
	res.render('css.css')
})

/**
 * Vai receber um valor hexa, e retornar em binario
 * @function
 * @param {String} hex valor hexa
 * @returns {String} valor em binario
 * @example
 * entrada: 0a0c
 * saida: 0000101000001100
 */
const Hexa2Binary = (hex) => {
	return parseInt(hex, 16).toString(2).padStart(8, '0')
}

/**
 * Vai receber um valor binario, e retornar em hexa
 * @function
 * @param {String} bin valor binario
 * @returns {String} valor em hexa
 * @example
 * entrada: 0000101000001100
 * saida: 0a0c
 */
const Binary2Hexa = (bin) => {
	return parseInt(bin, 2).toString(16).toUpperCase()
}

/**
 * Vai receber um valor binario, checar se é 16bit e se n for retornar ele em 16.
 * @function
 * @param {String} bin valor binario
 * @returns {String} novo binario
 * @example
 * entrada: 2479C
 * saida: 479E
 */
const Check16Bit = (bin) => {
	const hexa = Binary2Hexa(bin)
	return hexa.length === 4 ? bin : addBinary(Hexa2Binary(hexa.substring(1)), Hexa2Binary(hexa.charAt(0)))
}

/**
 * Vai receber um valor binario e inverte ele
 * @function
 * @param {String} bin valor binario
 * @returns {String} novo binario
 * @example
 * entrada: 10101
 * saida: 01010
 */
const InverterBinario = (bin) => {
	return bin
		.split('')
		.map((b) => (1 - b).toString())
		.join('')
}

/**
 * Vai receber um valor hexa, converter para binario, somar os bin e comparar com a header.
 * @function
 * @param {String} hexa valor hexadecimal
 * @param {String} header checksum final do ip
 * @returns {Object} com todos os calculos e se o resultado é verdadeiro ou não
 */
app.post('/checar', (req, res) => {
	const { body } = req
	const { hexa, header } = JSON.parse(body)
	const hexaUpcase = hexa.toUpperCase().trim()
	const headerUpcase = header.toUpperCase().trim()

	// 4500 16D8 1250 4000 4006 0000 C881 B028 BFDF B771
	const regexHexa = /^[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}$/
	// 50B2
	const regexHeader = /^[A-Z0-9]{4}$/

	if (!regexHexa.test(hexaUpcase)) {
		res.status(400).send({ status: 'error', message: 'Valor hexadecimal não é válido' })
	} else if (!regexHeader.test(headerUpcase)) {
		res.status(400).send({ status: 'error', message: 'Valor da header não é válido' })
	} else {
		const arrayHexa = hexaUpcase.split(/\s+/)

		// Primeiro vamos fazeer conversão do Hexa para o Binario
		const valorInicialBin = []
		arrayHexa.map((prop) => {
			// Não é necessario checar se é válido nesse momento.
			valorInicialBin.push({
				hexa: prop,
				binario: Hexa2Binary(prop)
			})
		})

		// Aqui é onde é feito a primeira soma
		const resultadoSoma = []
		for (let i = 0; i < 9; i++) {
			// Faço a soma dos dois primeiro valores, depois o resultado da soma é somado pelo proximo valor.
			if (i === 0) {
				// Nesse primeiro caso a soma é estática, sempre o index 0 + 1
				const bin1 = valorInicialBin[0].binario
				const bin2 = valorInicialBin[1].binario
				const soma = Check16Bit(addBinary(bin1, bin2))
				const bin2hexa = Binary2Hexa(soma)
				resultadoSoma.push({
					primeiroValor: {
						hexa: valorInicialBin[0].hexa,
						bin: bin1
					},
					segundoValor: {
						hexa: valorInicialBin[1].hexa,
						bin: bin2
					},
					resultado: {
						hexa: bin2hexa,
						soma: soma
					}
				})
			} else {
				// Já os outros casos os index mudam.
				const bin1 = valorInicialBin[i + 1].binario
				const bin2 = resultadoSoma[i - 1].resultado.soma
				const soma = Check16Bit(addBinary(bin1, bin2))
				const bin2hexa = Binary2Hexa(soma)
				resultadoSoma.push({
					primeiroValor: {
						hexa: valorInicialBin[i + 1].hexa,
						bin: bin1
					},
					segundoValor: {
						hexa: resultadoSoma[i - 1].resultado.hexa,
						bin: bin2
					},
					resultado: {
						hexa: bin2hexa,
						soma: soma
					}
				})
			}
		}

		// Nessa situação você simplesmente vai precisar inverter o resultado final.
		const binarioInvertido = InverterBinario(resultadoSoma[resultadoSoma.length - 1].resultado.soma)
		const hexaInvertido = Binary2Hexa(binarioInvertido)
		resultadoSoma.push({
			resultadoFinal: {
				hexa: hexaInvertido,
				bin: binarioInvertido
			}
		})

		res.send({ status: 'ok', resultadoSoma, valido: hexaInvertido === headerUpcase })
	}
})

app.listen(8000)
